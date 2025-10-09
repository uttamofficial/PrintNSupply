import React, { useState, useRef, useEffect } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Footer from './components/Footer';
import emailjs from 'emailjs-com';

const ContactUs = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    Email: '',
    Message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init('pNve9185cw30hDUqv');
  }, []);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    console.log('📧 Attempting to send email...');
    console.log('Service ID:', 'service_pji711e');
    console.log('Template ID:', 'template_fw9hhw2');
    console.log('Form data:', formData);

    // Log form fields for debugging
    if (form.current) {
      const formDataObj = new FormData(form.current);
      console.log('Form fields being sent:');
      formDataObj.forEach((value, key) => {
        console.log(`  ${key}: ${value}`);
      });
    }

    emailjs
      .sendForm(
        'service_pji711e',           // Your Service ID
        'template_fw9hhw2',          // Your Template ID
        form.current!
        // Public key already initialized in useEffect
      )
      .then(
        (result) => {
          console.log('✅ Email sent successfully:', result);
          setShowSuccess(true);
          setFormData({ name: '', phone: '', Email: '', Message: '' });
          form.current?.reset();
          
          // Hide success message after 5 seconds
          setTimeout(() => {
            setShowSuccess(false);
          }, 5000);
        },
        (error) => {
          console.error('❌ Email send failed - Full error:', error);
          console.error('Error text:', error.text);
          console.error('Error status:', error.status);
          
          let errorMessage = '❌ Failed to send message. ';
          
          if (error.text === 'The public key is invalid') {
            errorMessage += 'Invalid API key. Please check your EmailJS configuration.';
          } else if (error.text === 'Template not found') {
            errorMessage += 'Email template not found. Please create "template_contact_form" in EmailJS dashboard.';
          } else if (error.text === 'Service not found') {
            errorMessage += 'Email service not found. Please verify your Service ID.';
          } else {
            errorMessage += error.text || 'Please try again later.';
          }
          
          alert(errorMessage);
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 animate-slide-in border border-green-400">
          <CheckCircle2 size={24} />
          <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      {/* Contact Section - Enhanced */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 pt-24 sm:pt-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Information - Hidden on Mobile */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-2xl p-10 border-2 border-blue-600">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Get in Touch</h2>
              <p className="text-gray-600 text-lg">We're here to assist you with any queries or concerns.</p>
            </div>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Phone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-indigo-50 transition-colors group">
                <div className="bg-indigo-100 p-3 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Mail className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">PrintNSupply@gmail.com</p>
                  <p className="text-sm text-gray-500 mt-1">24/7 support</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-50 transition-colors group">
                <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">Office</h3>
                  <p className="text-gray-600">123 Business Street<br />New York, NY 10001</p>
                  <p className="text-sm text-gray-500 mt-1">Visit us during business hours</p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span className="text-xl">💡</span>
                Quick Response Time
              </h4>
              <p className="text-sm text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>

          {/* Contact Form - Enhanced & Mobile Optimized */}
          <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl lg:shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-blue-600 lg:col-span-1 col-span-1">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-sm sm:text-base text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
            </div>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-4 lg:space-y-5">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="Email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="Message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Your Message *
                </label>
                <textarea
                  id="Message"
                  name="Message"
                  rows={4}
                  value={formData.Message}
                  onChange={(e) => setFormData({...formData, Message: e.target.value})}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold text-base sm:text-lg flex items-center justify-center space-x-2 ${
                  isSending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
              
              <p className="text-[10px] sm:text-xs text-center text-gray-500 mt-3 sm:mt-4">
                * All fields are required
              </p>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
  
};

export default ContactUs;
