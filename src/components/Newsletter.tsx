import React, { useState } from 'react';
import { Send, CheckCircle, Mail, AlertCircle, RefreshCw } from 'lucide-react';
import { trackEvent } from '../lib/analytics';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Thank you for subscribing! You have been added to our updates list.');
        setEmail('');
        
        // Track subscription event
        trackEvent('newsletter_subscribe', 'engagement', 'Newsletter Section');

        // Save to local storage too so the browser remembers they subscribed
        try {
          const subscribedList = JSON.parse(localStorage.getItem('minerva_portfolio_newsletter') || '[]');
          if (!subscribedList.includes(email)) {
            subscribedList.push(email);
            localStorage.setItem('minerva_portfolio_newsletter', JSON.stringify(subscribedList));
          }
        } catch (e) {
          console.error('Local storage subscription record failed', e);
        }
      } else {
        throw new Error(data.error || 'Subscription failed');
      }
    } catch (err: any) {
      console.error('Subscription error:', err);
      setStatus('error');
      setMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="newsletter-subscription-section" className="py-16 bg-neutral-900 text-white relative overflow-hidden border-t border-gray-800">
      {/* Decorative background gradients to feel highly crafted and custom */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(51,51,255,0.12),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_-20%,rgba(228,240,231,0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Information column */}
          <div className="lg:col-span-6 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-[#E4F0E7] rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-white/5">
              <Mail className="w-3.5 h-3.5" />
              Newsletter
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mb-3">
              Stay in the Loop
            </h2>
            <p className="font-sans text-sm text-gray-300 leading-relaxed max-w-xl">
              Subscribe to Minnie's newsletter for exclusive insights on scaling enterprise operations, practical agentic AI transformation guidelines, and the latest tech leadership blueprints.
            </p>
          </div>

          {/* Form input column */}
          <div className="lg:col-span-6 w-full">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              {status === 'success' ? (
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left animate-fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-white text-base mb-1">
                    Successfully Subscribed!
                  </h3>
                  <p className="font-sans text-xs text-gray-300 leading-relaxed max-w-md">
                    {message}
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-xs font-mono font-bold text-[#E4F0E7] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Subscribe another email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5 text-left">
                    <label htmlFor="newsletter-email-input" className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <div className="relative flex flex-col sm:flex-row gap-3 mt-1">
                      <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
                          <Mail className="w-4 h-4" />
                        </span>
                        <input
                          type="email"
                          id="newsletter-email-input"
                          required
                          placeholder="you@domain.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                          }}
                          disabled={isSubmitting}
                          className="w-full pl-11 pr-4 py-3 bg-neutral-950/40 hover:bg-neutral-950/60 focus:bg-neutral-950/80 rounded-xl border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3333FF] focus:ring-1 focus:ring-[#3333FF] transition-all duration-200"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-[#3333FF] hover:bg-[#2222DD] text-[#E4F0E7] font-sans font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 disabled:opacity-50 select-none shrink-0"
                      >
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-[#E4F0E7]/30 border-t-[#E4F0E7] rounded-full animate-spin" />
                            <span>Joining...</span>
                          </>
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {status === 'error' && (
                    <div className="flex items-start gap-2 text-rose-400 text-xs text-left bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg animate-fade-in mt-1">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{message}</span>
                    </div>
                  )}

                  <p className="font-sans text-[10px] text-gray-400 text-left">
                    We value your privacy. No spam, just high-value executive digests. Unsubscribe at any time.
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
