'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

import { useConsent } from '../context/ConsentContext';
import { ANALYTICS_CONFIGURED, GA_ID } from '../lib/consent';

// Loads Google Analytics by default (using the site implies consent); it's switched off only
// if the visitor opts out via Cookie settings. No NEXT_PUBLIC_GA_MEASUREMENT_ID = this renders nothing at all.
function Analytics() {
    const { analyticsAllowed } = useConsent();
    if (!analyticsAllowed || !GA_ID) return null;
    // A `GTM-…` ID is a Tag Manager container (needs the GTM bootstrap); a `G-…` ID is a
    // GA4 measurement ID (needs gtag.js + config). They're initialised differently.
    if (GA_ID.startsWith('GTM-')) {
        return (
          <Script id="gtm-init" strategy="afterInteractive">{`
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
                (function(){var s=document.createElement('script');s.async=true;
                s.src='https://www.googletagmanager.com/gtm.js?id=${GA_ID}';
                document.head.appendChild(s);})();
            `}</Script>
        );
    }
    return (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}</Script>
      </>
    );
}

// Bottom notice (first visit, single OK button) and the preferences dialog (reachable any
// time from the footer / cookie policy, where analytics can be turned off).
export default function CookieConsent() {
    const { ready, choice, settingsOpen, setChoice, closeSettings } = useConsent();
    const [analyticsOn, setAnalyticsOn] = useState(false);

    useEffect(() => {
        // Preferences dialog opens reflecting the current choice.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (settingsOpen) setAnalyticsOn(choice !== 'essential');
    }, [settingsOpen, choice]);

    useEffect(() => {
        if (!settingsOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSettings(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [settingsOpen, closeSettings]);

    if (!ANALYTICS_CONFIGURED) return null;

    const showBanner = ready && choice === null && !settingsOpen;

    return (
        <>
            <Analytics />

            {showBanner && (
                <div className="lp-cookie-banner" role="dialog" aria-label="Cookie preferences" aria-live="polite">
                    <p>
                        By using this website, you consent to our use of cookies, including analytics cookies that help
                        us understand how the site is used and improve it. See our{' '}
                        <Link href="/cookie-policy">Cookie Policy</Link>.
                    </p>
                    <div className="lp-cookie-actions">
                        <button type="button" className="lp-btn lp-btn-primary" onClick={() => setChoice('all')}>OK</button>
                    </div>
                </div>
            )}

            {settingsOpen && (
                <div className="lp-cookie-overlay" onClick={closeSettings}>
                    <div className="lp-cookie-modal" role="dialog" aria-modal="true" aria-labelledby="ck-title" onClick={(e) => e.stopPropagation()}>
                        <h2 id="ck-title">Cookie preferences</h2>
                        <div className="lp-cookie-row">
                            <div>
                                <strong>Essential</strong>
                                <p>Remember your theme and your cookie choice. The site can&apos;t work properly without these, so they&apos;re always on.</p>
                            </div>
                            <span className="lp-cookie-always">Always on</span>
                        </div>
                        <div className="lp-cookie-row">
                            <div>
                                <strong>Analytics</strong>
                                <p>Google Analytics tells us which pages are visited and how people find us, so we can improve the site. On by default, and you can switch it off here at any time.</p>
                            </div>
                            <label className="lp-switch">
                                <input type="checkbox" checked={analyticsOn} onChange={(e) => setAnalyticsOn(e.target.checked)} aria-label="Allow analytics cookies" />
                                <span className="lp-switch-track" />
                            </label>
                        </div>
                        <div className="lp-cookie-actions">
                            <button type="button" className="lp-btn lp-btn-ghost" onClick={closeSettings}>Cancel</button>
                            <button type="button" className="lp-btn lp-btn-primary" onClick={() => setChoice(analyticsOn ? 'all' : 'essential')}>Save preferences</button>
                        </div>
                        <p className="lp-cookie-foot">Details in our <Link href="/cookie-policy" onClick={closeSettings}>Cookie Policy</Link>.</p>
                    </div>
                </div>
            )}
        </>
    );
}
