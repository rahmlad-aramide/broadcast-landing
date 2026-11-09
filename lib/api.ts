// The app (signup, dashboard, etc.) lives on a different origin from this marketing
// site, so any call to it needs an absolute URL — the backend's CORS_ORIGIN must
// include this site's domain for these requests to succeed.
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://app.broadcast.com.ng';

export interface SignupCustomerPayload {
    name: string;
    email: string;
    companyName?: string;
}

export async function signupCustomer(payload: SignupCustomerPayload): Promise<{ message: string }> {
    const res = await fetch(`${APP_URL}/api/auth/signup-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || 'Signup request failed. Please try again.');
    }
    return data;
}

export type ContactTopic = 'support' | 'billing' | 'inquiry' | 'partnership' | 'other';

export interface ContactPayload {
    name: string;
    email: string;
    topic: ContactTopic;
    message: string;
    /** Honeypot — must stay empty; bots fill it. */
    website?: string;
}

export async function sendContactMessage(payload: ContactPayload): Promise<{ message: string }> {
    const res = await fetch(`${APP_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || 'Could not send your message. Please try again.');
    }
    return data;
}
