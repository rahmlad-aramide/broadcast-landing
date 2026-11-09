'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { ANALYTICS_CONFIGURED, GA_ID, clearAnalyticsCookies, readConsent, writeConsent, type ConsentChoice } from '../lib/consent';

interface ConsentValue {
    /** null = not decided yet (banner shows). */
    choice: ConsentChoice | null;
    /** True once we've read the stored choice on the client (avoids a banner flash). */
    ready: boolean;
    analyticsAllowed: boolean;
    settingsOpen: boolean;
    openSettings: () => void;
    closeSettings: () => void;
    setChoice: (c: ConsentChoice) => void;
}

const ConsentContext = createContext<ConsentValue | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
    const [choice, setChoiceState] = useState<ConsentChoice | null>(null);
    const [ready, setReady] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    useEffect(() => {
        // Reading browser storage on mount: must happen after hydration so server and
        // client markup match, which is why this is an effect rather than an initialiser.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setChoiceState(readConsent());
        setReady(true);
    }, []);

    const setChoice = useCallback((c: ConsentChoice) => {
        writeConsent(c);
        setChoiceState(c);
        setSettingsOpen(false);
        if (c === 'essential') {
            // Withdrawing consent: stop Google Analytics immediately and remove its cookies.
            if (GA_ID) (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = true;
            clearAnalyticsCookies();
        } else if (GA_ID) {
            (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = false;
        }
    }, []);

    const value = useMemo<ConsentValue>(() => ({
        choice,
        ready,
        analyticsAllowed: ANALYTICS_CONFIGURED && choice === 'all',
        settingsOpen,
        openSettings: () => setSettingsOpen(true),
        closeSettings: () => setSettingsOpen(false),
        setChoice,
    }), [choice, ready, settingsOpen, setChoice]);

    return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent() {
    const ctx = useContext(ConsentContext);
    if (!ctx) throw new Error('useConsent must be used within a ConsentProvider');
    return ctx;
}
