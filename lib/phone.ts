// Turns a phone number typed in almost any format into the digits wa.me expects
// (international format, no +, no spaces, no leading zeros).

export interface Country { code: string; name: string; dial: string; flag: string }

// Dial code + the national number lengths we expect (used only to resolve ambiguous input).
export const COUNTRIES: Country[] = [
    { code: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', dial: '233', flag: '🇬🇭' },
    { code: 'KE', name: 'Kenya', dial: '254', flag: '🇰🇪' },
    { code: 'ZA', name: 'South Africa', dial: '27', flag: '🇿🇦' },
    { code: 'UG', name: 'Uganda', dial: '256', flag: '🇺🇬' },
    { code: 'TZ', name: 'Tanzania', dial: '255', flag: '🇹🇿' },
    { code: 'RW', name: 'Rwanda', dial: '250', flag: '🇷🇼' },
    { code: 'SN', name: 'Senegal', dial: '221', flag: '🇸🇳' },
    { code: 'CI', name: "Côte d'Ivoire", dial: '225', flag: '🇨🇮' },
    { code: 'EG', name: 'Egypt', dial: '20', flag: '🇪🇬' },
    { code: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
    { code: 'US', name: 'United States / Canada', dial: '1', flag: '🇺🇸' },
    { code: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
    { code: 'SA', name: 'Saudi Arabia', dial: '966', flag: '🇸🇦' },
    { code: 'IN', name: 'India', dial: '91', flag: '🇮🇳' },
    { code: 'PK', name: 'Pakistan', dial: '92', flag: '🇵🇰' },
    { code: 'BR', name: 'Brazil', dial: '55', flag: '🇧🇷' },
    { code: 'DE', name: 'Germany', dial: '49', flag: '🇩🇪' },
    { code: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
];

export type PhoneResult =
    | { ok: true; digits: string; display: string; note: string }
    | { ok: false; error: string };

/**
 * `defaultDial` is the country code to assume when the number is typed locally
 * (e.g. "0803 123 4567"). A "+" or "00" prefix always means the number already has its own code.
 */
export function normalizePhone(input: string, defaultDial = '234'): PhoneResult {
    const raw = input.trim();
    if (!raw) return { ok: false, error: 'Enter a phone number.' };
    if (/[a-z]/i.test(raw.replace(/ext\.?\s*\d+$/i, ''))) return { ok: false, error: 'Phone numbers should only contain digits, spaces, + ( ) and -.' };

    let digits = raw.replace(/\D/g, '');
    if (!digits) return { ok: false, error: 'Enter a phone number.' };

    let international = false;
    if (raw.startsWith('+')) { international = true; }
    else if (digits.startsWith('00')) { international = true; digits = digits.slice(2); }

    let note = '';
    if (international) {
        // "+234 0803 123 4567": people often keep the national leading zero after the code.
        const trunk = new RegExp(`^${defaultDial}0(\\d+)$`);
        const m = trunk.exec(digits);
        if (m) { digits = defaultDial + m[1]; note = 'Removed the extra 0 after the country code.'; }
    } else if (digits.startsWith('0')) {
        digits = defaultDial + digits.replace(/^0+/, '');
        note = `Local number: added +${defaultDial}.`;
    } else if (digits.startsWith(defaultDial) && digits.length - defaultDial.length >= 7) {
        // Already begins with the country code, typed without "+".
        const trunk = new RegExp(`^${defaultDial}0(\\d+)$`);
        const m = trunk.exec(digits);
        if (m) { digits = defaultDial + m[1]; note = 'Removed the extra 0 after the country code.'; }
    } else {
        // No leading 0 and no code, e.g. "803 123 4567": assume it's national.
        digits = defaultDial + digits;
        note = `Assumed a ${defaultDial} number.`;
    }

    if (digits.length < 8) return { ok: false, error: 'That number looks too short.' };
    if (digits.length > 15) return { ok: false, error: 'That number looks too long (international numbers have at most 15 digits).' };
    return { ok: true, digits, display: `+${digits}`, note };
}

export function buildWaLink(digits: string, message: string): string {
    const text = message.trim();
    return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
