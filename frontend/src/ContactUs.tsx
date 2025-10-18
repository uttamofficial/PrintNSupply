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
        <div className="fixed top-20 right-4 bg-green-500 text-white px-5 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2.5 animate-slide-in border border-green-400">
          <CheckCircle2 size={20} />
          <span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
        </div>
      )}

      {/* Contact Section - Enhanced */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 pt-24 sm:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Contact Information - Hidden on Mobile */}
          <div className="hidden lg:block bg-white rounded-lg shadow-lg p-6 border-2 border-blue-600">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
              <p className="text-gray-600 text-sm">We're here to assist you with any queries or concerns.</p>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-blue-50 transition-colors group">
                <div className="bg-blue-100 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Phone</h3>
                  <p className="text-gray-600 text-xs">+1 (555) 123-4567</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-indigo-50 transition-colors group">
                <div className="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
                  <Mail className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Email</h3>
                  <p className="text-gray-600 text-xs">PrintNSupply@gmail.com</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">24/7 support</p>
                </div>
              </div>

              {/* Office */}
              <div className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-purple-50 transition-colors group">
                <div className="bg-purple-100 p-2 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-0.5">Office</h3>
                  <p className="text-gray-600 text-xs">123 Business Street<br />New York, NY 10001</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Visit us during business hours</p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-5 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2 text-sm">
                <span className="text-base">💡</span>
                Quick Response Time
              </h4>
              <p className="text-xs text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>

          {/* Contact Form - Enhanced & Mobile Optimized */}
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-5 lg:p-6 border-2 border-blue-600 lg:col-span-1 col-span-1">
            <div className="mb-4 lg:mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1.5">Send us a Message</h2>
              <p className="text-xs sm:text-sm text-gray-600">Fill out the form below and we'll get back to you shortly.</p>
            </div>
            
            <form ref={form} onSubmit={sendEmail} className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-2.5 sm:px-3 py-2 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-2.5 sm:px-3 py-2 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="Email" className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="Email"
                  name="Email"
                  value={formData.Email}
                  onChange={(e) => setFormData({...formData, Email: e.target.value})}
                  className="w-full px-2.5 sm:px-3 py-2 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="Message" className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  id="Message"
                  name="Message"
                  rows={4}
                  value={formData.Message}
                  onChange={(e) => setFormData({...formData, Message: e.target.value})}
                  className="w-full px-2.5 sm:px-3 py-2 text-sm border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-gray-300 resize-none"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm flex items-center justify-center space-x-2 ${
                  isSending ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>{isSending ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
              
              <p className="text-[10px] text-center text-gray-500 mt-2">
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
