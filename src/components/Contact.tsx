import React, { useState } from 'react';
import { Mail, Phone, Linkedin, MapPin, Send, CheckCircle2, MessageSquare, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { personalInfo } from '../data/resumeData';
import { trackEvent } from '../lib/analytics';

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  body: string;
  date: string;
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'simulated' | 'sent' | 'error'>('idle');
  
  // Local messages retrieval for the visitor to "see" their submitted message in a simulation sandbox
  const [savedMessages, setSavedMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem('minerva_portfolio_messages');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      const isReal = result.status === 'sent';

      const newMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        email: formData.email,
        subject: formData.subject || 'General Inquiry',
        body: formData.message,
        date: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      const updated = [newMessage, ...savedMessages];
      setSavedMessages(updated);
      try {
        localStorage.setItem('minerva_portfolio_messages', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }

      // Track contact form submission event
      trackEvent('contact_form_submit', 'engagement', formData.subject || 'General Inquiry');

      setSubmitStatus(isReal ? 'sent' : 'simulated');
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Clear success overlay after 6 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitStatus('idle');
      }, 6000);
    } catch (err) {
      console.error('Failed to submit message:', err);
      setSubmitStatus('error');
      setSubmitSuccess(true);
      // Keep error overlay open for 6 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setSubmitStatus('idle');
      }, 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteMessage = (id: string) => {
    const filtered = savedMessages.filter(m => m.id !== id);
    setSavedMessages(filtered);
    try {
      localStorage.setItem('minerva_portfolio_messages', JSON.stringify(filtered));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div id="contact-section-header" className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#3333FF] bg-[#E4F0E7] px-3 py-1 rounded-full">
            Inquiries & Collaborations
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-gray-900 tracking-tight mt-3 mb-4">
            Connect & Collaborate
          </h2>
          <p className="font-sans text-base text-gray-600 leading-relaxed">
            Interested in scaling agentic workflows, deploying enterprise Google Cloud projects, or scheduling consultations? Reach out directly or leave a secure message below.
          </p>
        </div>

        {/* Contact Layout */}
        <div id="contact-main-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Quick Contact & Details */}
          <div id="contact-details-col" className="lg:col-span-5 flex flex-col gap-8">
            
            <div id="contact-info-card" className="bg-neutral-50 rounded-2xl border border-gray-100 p-8 flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-accent" />
              
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                Direct Channels
              </h3>

              {/* LinkedIn */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-500 shadow-3xs">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">
                    LinkedIn Network
                  </h4>
                  <a
                    id="contact-linkedin-link"
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans font-semibold text-sm text-gray-900 hover:text-blue-600 transition-colors mt-1 block"
                  >
                    linkedin.com/in/minnieott
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-3xs">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-xs text-gray-400 uppercase tracking-wider">
                    Location
                  </h4>
                  <span className="font-sans font-semibold text-sm text-gray-800 mt-1 block">
                    {personalInfo.location}
                  </span>
                </div>
              </div>

            </div>

            {/* Google Appointment Calendar Booking Card */}
            <div id="contact-booking-card" className="bg-neutral-50 rounded-2xl border border-gray-100 p-8 flex flex-col gap-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#3333FF]" />
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E4F0E7] border border-[#3333FF]/10 flex items-center justify-center text-[#3333FF] shrink-0 shadow-3xs">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-gray-900 text-lg">
                    Book an Appointment
                  </h3>
                  <p className="font-mono text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">
                    Google Appointment Calendar
                  </p>
                </div>
              </div>

              <p className="font-sans text-sm text-gray-600 leading-relaxed">
                Schedule a 1:1 consultation, advisory session, or project sync directly via Minnie's calendar. Select a time that fits your schedule.
              </p>

              <a
                id="booking-calendar-link"
                href="https://calendar.app.google/MCnhZcK56rLJ7fnk8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-[#E4F0E7] text-[#3333FF] font-sans font-semibold text-sm rounded-lg border border-[#3333FF]/30 hover:border-[#3333FF] shadow-3xs transition-all duration-200 hover:scale-[1.01]"
              >
                <span>Schedule a Session</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Secure Message Form */}
          <div id="contact-form-col" className="lg:col-span-7">
            <div className="bg-neutral-50 rounded-2xl border border-gray-100 p-8 shadow-3xs relative overflow-hidden">
              
              {submitSuccess && (
                <div
                  id="form-success-overlay"
                  className="absolute inset-0 bg-white/95 backdrop-blur-xs flex flex-col items-center justify-center text-center p-8 z-25 transition-all duration-300"
                >
                  {submitStatus === 'error' ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 border border-rose-100">
                        <span className="text-rose-500 text-2xl font-bold font-sans">✕</span>
                      </div>
                      <h3 className="font-display font-bold text-gray-900 text-xl tracking-tight">
                        Failed to send email
                      </h3>
                      <p className="font-sans text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                        There was an error communicating with the email service. Please try again.
                      </p>
                    </>
                  ) : submitStatus === 'sent' ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-scale-up mb-4" />
                      <h3 className="font-display font-bold text-gray-900 text-xl tracking-tight">
                        Email sent successfully!
                      </h3>
                      <p className="font-sans text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                        Your message has been sent directly to Minerva without opening a mail client.
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-[#3333FF] animate-scale-up mb-4" />
                      <h3 className="font-display font-bold text-gray-900 text-xl tracking-tight">
                        Message simulated successfully!
                      </h3>
                      <p className="font-sans text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
                        Saved to sandbox. To send actual emails, configure <code className="bg-neutral-100 text-indigo-600 px-1 py-0.5 rounded font-mono text-xs">RESEND_API_KEY</code> in the Secrets panel.
                      </p>
                    </>
                  )}
                </div>
              )}

              <h3 className="font-display font-bold text-gray-900 text-lg mb-6">
                Send a Direct Message
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name-input" className="font-mono text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Full Name / Organization *
                  </label>
                  <input
                    type="text"
                    id="name-input"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email-input" className="font-mono text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email-input"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all"
                  />
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="subject-input" className="font-mono text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject-input"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we collaborate?"
                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message-input" className="font-mono text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    id="message-input"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write details of your project or proposal..."
                    className="px-4 py-3 bg-white rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all resize-none"
                  />
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  id="form-submit-btn"
                  disabled={isSubmitting}
                  className="mt-2 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#3333FF] hover:bg-[#2222DD] text-[#E4F0E7] font-sans font-semibold text-sm rounded-lg border border-[#3333FF] shadow-xs cursor-pointer select-none transition-all duration-200 disabled:opacity-50 accent-glow hover:accent-glow-strong"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Secure Message <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
