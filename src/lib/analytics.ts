// Google Analytics Integration
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Initializes Google Analytics (gtag.js) dynamically if VITE_GA_MEASUREMENT_ID is configured.
 */
export function initGA() {
  const measurementId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-KH1F2ZJ32Y';
  
  if (!measurementId) {
    console.log('[Analytics] No VITE_GA_MEASUREMENT_ID found in environment variables. Analytics will run in offline mode.');
    return;
  }

  // Prevent duplicate script insertion if it already exists or was loaded via index.html
  if (document.getElementById('google-analytics-gtag') || typeof window.gtag === 'function') {
    console.log(`[Analytics] Google Analytics already active with ID: ${measurementId}`);
    return;
  }

  try {
    // 1. Inject the Google Analytics script tag
    const script = document.createElement('script');
    script.id = 'google-analytics-gtag';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // 2. Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(arguments);
    };

    // 3. Configure Google Analytics
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: false // We will trigger page views manually when custom routing changes
    });

    console.log(`[Analytics] Google Analytics initialized successfully with ID: ${measurementId}`);
  } catch (error) {
    console.error('[Analytics] Failed to initialize Google Analytics:', error);
  }
}

/**
 * Tracks a page view event. Call this when routes or views change.
 * @param path The URL path (e.g. '/' or '/blog')
 * @param title Optional title of the page being tracked
 */
export function trackPageView(path: string, title?: string) {
  const measurementId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID || 'G-KH1F2ZJ32Y';
  if (!measurementId) return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title,
      send_to: measurementId
    });
    console.log(`[Analytics] Page view tracked for: ${path}`);
  }
}

/**
 * Tracks custom interaction events (e.g., newsletter subscribe, contact form submit).
 * @param action The interaction category (e.g. 'submit_form')
 * @param category The event category (e.g. 'engagement')
 * @param label Optional text describing the event further
 * @param value Optional numeric value associated with the event
 */
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
    console.log(`[Analytics] Event tracked: ${action} [${category}]`);
  }
}
