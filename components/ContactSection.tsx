'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, LifeBuoy, Mail, Send } from 'lucide-react';

import { sendContactMessage, type ContactTopic } from '../lib/api';

export const INFO_EMAIL = 'info@broadcast.com.ng';
export const SUPPORT_EMAIL = 'support@broadcast.com.ng';

const TOPICS: { value: ContactTopic; label: string }[] = [
    { value: 'inquiry', label: 'General inquiry' },
    { value: 'support', label: 'Support / help with my account' },
    { value: 'billing', label: 'Billing' },
    { value: 'partnership', label: 'Partnership / sales' },
    { value: 'other', label: 'Other' },
];

export default function ContactSection() {
    const [form, setForm] = useState({ name: '', email: '', topic: 'inquiry' as ContactTopic, message: '', website: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState('');

    const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setError('');
        try {
            await sendContactMessage(form);
            setStatus('sent');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
            setStatus('idle');
        }
    };

    const routesToSupport = form.topic === 'support' || form.topic === 'billing';

    return (
        <section className="lp-section lp-section-alt" id="contact">
            <div className="lp-section-inner">
                <div className="lp-eyebrow">Contact us</div>
                <h2 className="lp-section-title">Questions? We&apos;re here to help</h2>
                <p className="lp-section-sub">
                    Send us a message and we&apos;ll reply within 1 business day, or email us directly.
                </p>

                <div className="lp-contact-grid">
                    <div className="lp-contact-cards">
                        <a className="lp-contact-card" href={`mailto:${INFO_EMAIL}`}>
                            <Mail size={22} />
                            <div>
                                <strong>General inquiries</strong>
                                <span>{INFO_EMAIL}</span>
                                <small>Pricing, partnerships, anything else</small>
                            </div>
                        </a>
                        <a className="lp-contact-card" href={`mailto:${SUPPORT_EMAIL}`}>
                            <LifeBuoy size={22} />
                            <div>
                                <strong>Support &amp; help</strong>
                                <span>{SUPPORT_EMAIL}</span>
                                <small>Already using Broadcast and need a hand</small>
                            </div>
                        </a>
                    </div>

                    <div className="lp-contact-form-wrap">
                        {status === 'sent' ? (
                            <div className="lp-contact-success" role="status">
                                <CheckCircle2 size={40} />
                                <h3>Message sent</h3>
                                <p>Thanks! We&apos;ve emailed a confirmation to {form.email} and will reply within 1 business day.</p>
                                <button
                                    type="button"
                                    className="lp-btn lp-btn-ghost"
                                    onClick={() => { setForm({ name: '', email: '', topic: 'inquiry', message: '', website: '' }); setStatus('idle'); }}
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form className="lp-contact-form" onSubmit={onSubmit} noValidate={false}>
                                <div className="lp-field-row">
                                    <div className="lp-field">
                                        <label htmlFor="ct-name">Your name</label>
                                        <input id="ct-name" type="text" required maxLength={100} autoComplete="name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                                    </div>
                                    <div className="lp-field">
                                        <label htmlFor="ct-email">Email</label>
                                        <input id="ct-email" type="email" required maxLength={254} autoComplete="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
                                    </div>
                                </div>
                                <div className="lp-field">
                                    <label htmlFor="ct-topic">What is this about?</label>
                                    <select id="ct-topic" value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                                        {TOPICS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                    <small className="lp-field-hint">
                                        Goes to {routesToSupport ? SUPPORT_EMAIL : INFO_EMAIL}
                                    </small>
                                </div>
                                <div className="lp-field">
                                    <label htmlFor="ct-message">Message</label>
                                    <textarea id="ct-message" required minLength={10} maxLength={3000} rows={5} value={form.message} onChange={(e) => set('message', e.target.value)} />
                                </div>
                                {/* Honeypot: hidden from people and assistive tech; bots fill it in. */}
                                <div className="lp-hp" aria-hidden="true">
                                    <label htmlFor="ct-website">Website</label>
                                    <input id="ct-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => set('website', e.target.value)} />
                                </div>
                                {error && <p className="lp-contact-error" role="alert">{error}</p>}
                                <button type="submit" className="lp-btn lp-btn-primary lp-btn-lg" disabled={status === 'sending'}>
                                    {status === 'sending' ? 'Sending…' : <>Send message <Send size={16} /></>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
