'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Monitor, Moon, Sun } from 'lucide-react';

import { useTheme, type ThemePreference } from '../context/ThemeContext';

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
    { value: 'system', label: 'System', Icon: Monitor },
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
];

// Icon button opening a small System / Light / Dark menu.
export default function ThemeMenu() {
    const { preference, setPreference } = useTheme();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const current = OPTIONS.find((o) => o.value === preference) ?? OPTIONS[0];

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent | TouchEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector<HTMLButtonElement>('.lp-theme-toggle')?.focus(); }
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('touchstart', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    return (
        <div className="lp-theme-menu" ref={ref}>
            <button
                type="button"
                className="lp-theme-toggle"
                aria-label={`Theme: ${current.label}. Change theme`}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <current.Icon size={18} />
            </button>
            {open && (
                <div className="lp-theme-list" role="menu" aria-label="Theme">
                    {OPTIONS.map(({ value, label, Icon }) => (
                        <button
                            key={value}
                            type="button"
                            role="menuitemradio"
                            aria-checked={preference === value}
                            className={preference === value ? 'active' : ''}
                            onClick={() => { setPreference(value); setOpen(false); }}
                        >
                            <Icon size={16} /> <span>{label}</span>
                            {preference === value && <Check size={14} className="lp-theme-check" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
