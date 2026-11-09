'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
type Theme = 'dark' | 'light';

interface ThemeContextValue {
    /** What's actually applied. */
    theme: Theme;
    /** What the user picked; 'system' follows the device. */
    preference: ThemePreference;
    setPreference: (p: ThemePreference) => void;
    toggleTheme: () => void;
}

// The preference is saved in a cookie on the parent domain as well as localStorage, so a
// choice made here carries over to app.broadcast.com.ng (localStorage can't cross
// origins). Cookie wins when both exist. Keep in sync with the dashboard's ThemeContext
// and the inline script in app/layout.tsx.
const KEY = 'theme';
const PARENT_DOMAIN = 'broadcast.com.ng';
const VALID: ThemePreference[] = ['system', 'light', 'dark'];

function readPreference(): ThemePreference {
    let v: string | null = null;
    try {
        const m = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=([^;]+)'));
        v = m ? decodeURIComponent(m[1]) : null;
    } catch { /* ignore */ }
    if (!VALID.includes(v as ThemePreference)) {
        try { v = localStorage.getItem(KEY); } catch { v = null; }
    }
    return VALID.includes(v as ThemePreference) ? (v as ThemePreference) : 'system';
}

function persist(pref: ThemePreference) {
    try { localStorage.setItem(KEY, pref); } catch { /* storage blocked */ }
    try {
        const host = window.location.hostname;
        const shared = host === PARENT_DOMAIN || host.endsWith('.' + PARENT_DOMAIN);
        document.cookie = [
            `${KEY}=${pref}`, 'Path=/', 'Max-Age=31536000', 'SameSite=Lax',
            ...(shared ? [`Domain=.${PARENT_DOMAIN}`, 'Secure'] : []),
        ].join('; ');
    } catch { /* cookies blocked */ }
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// External stores read through useSyncExternalStore: the server snapshot ('system' / 'dark')
// matches first client render so hydration is clean, then React swaps in the real values.
// The inline <head> script has already applied the right data-theme, so nothing flashes.
let currentPref: ThemePreference | null = null;
const prefListeners = new Set<() => void>();
const subscribePref = (cb: () => void) => { prefListeners.add(cb); return () => { prefListeners.delete(cb); }; };
const getPref = () => (currentPref ??= readPreference());

const MQ = '(prefers-color-scheme: light)';
const subscribeSystem = (cb: () => void) => {
    const mq = window.matchMedia(MQ);
    mq.addEventListener('change', cb);
    return () => mq.removeEventListener('change', cb);
};
const getSystem = (): Theme => (window.matchMedia(MQ).matches ? 'light' : 'dark');

export function ThemeProvider({ children }: { children: ReactNode }) {
    const preference = useSyncExternalStore<ThemePreference>(subscribePref, getPref, () => 'system');
    const system = useSyncExternalStore<Theme>(subscribeSystem, getSystem, () => 'dark');

    const theme: Theme = preference === 'system' ? system : preference;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.style.colorScheme = theme;
    }, [theme]);

    const setPreference = useCallback((p: ThemePreference) => {
        currentPref = p;
        persist(p);
        prefListeners.forEach((l) => l());
    }, []);
    const toggleTheme = useCallback(() => setPreference(theme === 'dark' ? 'light' : 'dark'), [theme, setPreference]);

    const value = useMemo(() => ({ theme, preference, setPreference, toggleTheme }), [theme, preference, setPreference, toggleTheme]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
    return ctx;
}
