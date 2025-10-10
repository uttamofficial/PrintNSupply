import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Mail, User, CreditCard, Truck } from 'lucide-react';
import { useCart } from './components/CartContext';
import { useUser } from '@clerk/clerk-react';
import Footer from './components/Footer';
import { ShippingAddress } from './types';

function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useUser();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Online'>('COD');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 1660;
  const total = subtotal + shipping;

  const validateForm = (): boolean => {
    const newErrors: Partial<ShippingAddress> = {};

    if (!shippingAddress.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shippingAddress.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) newErrors.email = 'Email is invalid';
    if (!shippingAddress.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^[0-9]{10}$/.test(shippingAddress.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!shippingAddress.address.trim()) newErrors.address = 'Address is required';
    if (!shippingAddress.city.trim()) newErrors.city = 'City is required';
    if (!shippingAddress.state.trim()) newErrors.state = 'State is required';
    if (!shippingAddress.pincode.trim()) newErrors.pincode = 'Pincode is required';
    if (!/^[0-9]{6}$/.test(shippingAddress.pincode)) newErrors.pincode = 'Pincode must be 6 digits';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'Online') {
        // Redirect to Stripe payment page
        navigate('/payment', {
          state: {
            shippingAddress,
            cart,
            subtotal,
            shipping,
            total,
          },
        });
      } else {
        // Process COD order
        const orderData = {
          userId: user?.id || 'guest',
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          shippingAddress,
          subtotal,
          shipping,
          total,
          paymentMethod: 'COD',
        };

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Failed to create order');
        }

        const result = await response.json();
        
        // Clear cart and redirect to success page
        clearCart();
        navigate('/order-success', { state: { orderId: result.order.id } });
      }
    } catch (error) {
      console.error('Error processing order:', error);
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 pt-20">
          <div className="text-center bg-white p-8 rounded-xl shadow-xl border-2 border-blue-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Add some items to get started!</p>
            <button
              onClick={() => navigate('/stationery')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-24 sm:pt-28">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-4 sm:p-6 space-y-5 sm:space-y-6 border-2 border-blue-100">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <User size={20} className="sm:w-6 sm:h-6" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="John Doe"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="john@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <MapPin size={20} className="sm:w-6 sm:h-6" />
                  Shipping Address
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                      Address *
                    </label>
                    <textarea
                      value={shippingAddress.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows={2}
                      placeholder="House no., Street, Area"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Mumbai"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.state ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Maharashtra"
                      />
                      {errors.state && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.state}</p>
                      )}
                    </div>

                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.pincode}
                        onChange={(e) => handleInputChange('pincode', e.target.value)}
                        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                          errors.pincode ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="400001"
                        maxLength={6}
                      />
                      {errors.pincode && (
                        <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.pincode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="sm:w-6 sm:h-6" />
                  Payment Method
                </h2>
                <div className="space-y-2 sm:space-y-3">
                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'COD')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-2 sm:ml-3 flex items-center gap-2">
                      <Truck size={16} className="sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Cash on Delivery (COD)</span>
                    </div>
                  </label>

                  <label className="flex items-center p-3 sm:p-4 border-2 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online"
                      checked={paymentMethod === 'Online'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'Online')}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-2 sm:ml-3 flex items-center gap-2">
                      <CreditCard size={16} className="sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base font-medium">Online Payment</span>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isProcessing ? 'Processing...' : paymentMethod === 'COD' ? 'Place Order' : 'Proceed to Payment'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 pt-8 sm:pt-10 lg:sticky lg:top-4 border-2 border-blue-100">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Order Summary</h2>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 max-h-60 sm:max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-2 sm:gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-xs sm:text-sm font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 sm:pt-4 space-y-2">
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">₹{shipping.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-base sm:text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CheckoutPage;
