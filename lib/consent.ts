// Cookie-consent storage. The choice is saved in a cookie on the parent domain so that
// app.broadcast.com.ng can honour it too (same approach as the theme cookie), plus
// localStorage as a fallback. Re-asked after CONSENT_MAX_AGE so it never goes stale.

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
/** Without an analytics ID there is nothing to consent to, so no banner is shown. */
export const ANALYTICS_CONFIGURED = GA_ID.length > 0;

const KEY = 'cookie_consent';
const PARENT_DOMAIN = 'broadcast.com.ng';
const CONSENT_MAX_AGE = 60 * 60 * 24 * 365; // 12 months

export type ConsentChoice = 'all' | 'essential';

export function readConsent(): ConsentChoice | null {
    let v: string | null = null;
    try {
        const m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]+)'));
        v = m ? decodeURIComponent(m[1]) : null;
    } catch { /* ignore */ }
    if (v !== 'all' && v !== 'essential') {
        try { v = localStorage.getItem(KEY); } catch { v = null; }
    }
    return v === 'all' || v === 'essential' ? v : null;
}

export function writeConsent(choice: ConsentChoice) {
    try { localStorage.setItem(KEY, choice); } catch { /* storage blocked */ }
    try {
        const host = window.location.hostname;
        const shared = host === PARENT_DOMAIN || host.endsWith('.' + PARENT_DOMAIN);
        document.cookie = [
            `${KEY}=${choice}`, 'Path=/', `Max-Age=${CONSENT_MAX_AGE}`, 'SameSite=Lax',
            ...(shared ? [`Domain=.${PARENT_DOMAIN}`, 'Secure'] : []),
        ].join('; ');
    } catch { /* cookies blocked */ }
}

/** Remove analytics cookies already set (Google Analytics: _ga, _ga_<id>, _gid, _gat). */
export function clearAnalyticsCookies() {
    try {
        const host = window.location.hostname;
        const domains = [host, '.' + host, '.' + PARENT_DOMAIN];
        document.cookie.split('; ').forEach((c) => {
            const name = c.split('=')[0];
            if (/^(_ga|_gid|_gat)/.test(name)) {
                domains.forEach((d) => { document.cookie = `${name}=; Max-Age=0; Path=/; Domain=${d}`; });
                document.cookie = `${name}=; Max-Age=0; Path=/`;
            }
        });
    } catch { /* ignore */ }
}
