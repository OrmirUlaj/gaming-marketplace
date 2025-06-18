import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Contact form submitted:', data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Contact <span className="text-cyan-400">Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions, suggestions, or need support? We'd love to hear from you!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              💬 Send us a Message
            </h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register('subject', { 
                    required: 'Subject is required',
                    minLength: { value: 5, message: 'Subject must be at least 5 characters' }
                  })}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors"
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register('message', { 
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Message must be at least 10 characters' }
                  })}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-gray-300 rounded-lg border border-white/30 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-colors resize-none"
                  placeholder="Tell us what you're thinking..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                📍 Get in Touch
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">🎮</span>
                  <div>
                    <p className="font-semibold text-white">Gaming Support</p>
                    <p className="text-sm">Need help with your games or account? We're here to help!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">💼</span>
                  <div>
                    <p className="font-semibold text-white">Business Inquiries</p>
                    <p className="text-sm">Interested in partnering with us or have a business proposal?</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400 mt-1">🐛</span>
                  <div>
                    <p className="font-semibold text-white">Bug Reports</p>
                    <p className="text-sm">Found a bug? Let us know so we can fix it quickly!</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl shadow-lg p-8 backdrop-blur-sm border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                ⚡ Quick Response
              </h3>
              <div className="space-y-3 text-gray-300">
                <p className="text-sm">
                  📧 <span className="text-cyan-400">Email Response:</span> Within 24 hours
                </p>
                <p className="text-sm">
                  💬 <span className="text-cyan-400">General Inquiries:</span> Same day
                </p>
                <p className="text-sm">
                  🆘 <span className="text-cyan-400">Support Issues:</span> Within 2-4 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}