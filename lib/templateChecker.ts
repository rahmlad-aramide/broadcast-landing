// Draft model, rule checker and JSON export for WhatsApp message templates.
//
// The rules are the ones Meta most commonly rejects templates for. They are guidance, not a
// guarantee: Meta's own review is the authority and its rules change, so the UI says so.

export type Category = 'MARKETING' | 'UTILITY';
export type HeaderType = 'NONE' | 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'VIDEO';
export type ButtonType = 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';

export interface DraftButton { type: ButtonType; text: string; value: string; example: string }
export interface Draft {
    name: string;
    language: string;
    category: Category;
    headerType: HeaderType;
    headerText: string;
    headerExample: string;
    body: string;
    samples: string[]; // sample value for {{1}}, {{2}}, ...
    footer: string;
    buttons: DraftButton[];
}

export type Level = 'error' | 'warning' | 'tip';
export interface Issue { level: Level; message: string }

export const LIMITS = { name: 512, body: 1024, header: 60, footer: 60, button: 25, buttons: 10, urlButtons: 2, phoneButtons: 1 };

export const LANGUAGES: [string, string][] = [
    ['en', 'English'], ['en_US', 'English (US)'], ['en_GB', 'English (UK)'], ['fr', 'French'], ['ar', 'Arabic'],
    ['ha', 'Hausa'], ['yo', 'Yoruba'], ['sw', 'Swahili'], ['pt_BR', 'Portuguese (Brazil)'], ['es', 'Spanish'],
];

export const emptyDraft = (): Draft => ({
    name: '', language: 'en', category: 'UTILITY', headerType: 'NONE', headerText: '', headerExample: '',
    body: '', samples: [], footer: '', buttons: [],
});

const VAR = /\{\{\s*([^}]*?)\s*\}\}/g;

/** Variable tokens in a string, in order: [{ raw: "{{1}}", inner: "1", index }] */
export function variablesIn(text: string): { raw: string; inner: string; index: number }[] {
    return [...text.matchAll(VAR)].map((m) => ({ raw: m[0], inner: m[1], index: m.index ?? 0 }));
}

/** Highest numbered variable ({{1}}…{{n}}) used in the body. */
export function bodyVariableCount(body: string): number {
    const nums = variablesIn(body).map((v) => Number(v.inner)).filter((n) => Number.isInteger(n) && n > 0);
    return nums.length ? Math.max(...nums) : 0;
}

const PROMO = /\b(sale|discount|\d+\s?%\s?off|% off|offer|promo|promotion|limited[- ]time|buy now|deal|free gift|shop now|special price|coupon|win a|giveaway|cashback)\b/i;
const SHORTENERS = /\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rb\.gy|cutt\.ly|shorturl\.at)\b/i;
const OPT_OUT = /\b(stop|opt[- ]?out|unsubscribe)\b/i;
const EMOJI = /\p{Extended_Pictographic}/gu;

export function checkDraft(d: Draft): Issue[] {
    const out: Issue[] = [];
    const add = (level: Level, message: string) => out.push({ level, message });

    // ── Name ──
    if (!d.name.trim()) add('error', 'Give the template a name.');
    else {
        if (!/^[a-z0-9_]+$/.test(d.name)) add('error', 'Name can only use lowercase letters, numbers and underscores (e.g. order_update_1).');
        if (d.name.length > LIMITS.name) add('error', `Name is over ${LIMITS.name} characters.`);
    }

    // ── Body ──
    const body = d.body;
    if (!body.trim()) add('error', 'The message body is required.');
    if (body.length > LIMITS.body) add('error', `Body is ${body.length} characters; the limit is ${LIMITS.body}.`);

    const vars = variablesIn(body);
    const named = vars.filter((v) => !/^\d+$/.test(v.inner));
    if (named.length) add('error', `Use numbered variables like {{1}} (found ${named.map((v) => v.raw).join(', ')}).`);
    const nums = [...new Set(vars.filter((v) => /^\d+$/.test(v.inner)).map((v) => Number(v.inner)))].sort((a, b) => a - b);
    if (nums.length && nums.some((n, i) => n !== i + 1)) add('error', 'Variables must run in order with no gaps: {{1}}, {{2}}, {{3}}…');
    const trimmed = body.trim();
    if (vars.length && /^\{\{\s*\d+\s*\}\}/.test(trimmed)) add('warning', 'The body starts with a variable. Meta often rejects this: begin with some text.');
    if (vars.length && /\{\{\s*\d+\s*\}\}[.!?]?$/.test(trimmed)) add('warning', 'The body ends with a variable. Meta often rejects this: add a closing line of text.');
    if (/\}\}\s*\{\{/.test(body)) add('warning', 'Two variables sit side by side. Separate them with words.');
    if (nums.length) {
        const words = body.replace(VAR, ' ').split(/\s+/).filter(Boolean).length;
        if (words < nums.length * 3) add('warning', 'Too many variables for the amount of text. Add more wording around them or use fewer variables.');
    }
    if (/ {4,}/.test(body)) add('error', 'Remove runs of 4 or more spaces.');
    if (SHORTENERS.test(body)) add('warning', 'Shortened links (bit.ly, tinyurl…) are commonly rejected. Use your full link.');
    const letters = body.replace(/[^A-Za-z]/g, '');
    if (letters.length >= 20 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.6) add('tip', 'Lots of capital letters can read as shouting and get flagged. Use sentence case.');
    if ((body.match(EMOJI) || []).length > 8) add('tip', 'Many emojis can look spammy. A couple go a long way.');

    // ── Category ──
    if (d.category === 'UTILITY' && PROMO.test(`${body} ${d.headerText} ${d.footer}`)) {
        add('warning', 'This reads like promotion. Meta may reclassify a Utility template as Marketing, which costs more per message.');
    }
    if (d.category === 'MARKETING' && body.trim() && !OPT_OUT.test(`${body} ${d.footer}`) && !d.buttons.some((b) => /stop|unsubscribe|opt/i.test(b.text))) {
        add('tip', 'Marketing messages should make opting out easy: add a line like “Reply STOP to unsubscribe” (in the footer works well).');
    }

    // ── Header ──
    if (d.headerType === 'TEXT') {
        if (!d.headerText.trim()) add('error', 'Header is set to Text but is empty.');
        if (d.headerText.length > LIMITS.header) add('error', `Header is ${d.headerText.length} characters; the limit is ${LIMITS.header}.`);
        const hv = variablesIn(d.headerText);
        if (hv.length > 1) add('error', 'A text header can contain at most one variable.');
        if (/[*_~`\n]/.test(d.headerText.replace(VAR, ''))) add('warning', 'Headers can’t use bold/italic markers or line breaks.');
    } else if (d.headerType !== 'NONE') {
        add('tip', `A ${d.headerType.toLowerCase()} header needs a sample file when you submit the template, so Meta can review how it looks.`);
    }

    // ── Footer ──
    if (d.footer.length > LIMITS.footer) add('error', `Footer is ${d.footer.length} characters; the limit is ${LIMITS.footer}.`);
    if (variablesIn(d.footer).length) add('error', 'The footer can’t contain variables.');

    // ── Buttons ──
    if (d.buttons.length > LIMITS.buttons) add('error', `At most ${LIMITS.buttons} buttons are allowed.`);
    if (d.buttons.filter((b) => b.type === 'URL').length > LIMITS.urlButtons) add('error', `At most ${LIMITS.urlButtons} website buttons are allowed.`);
    if (d.buttons.filter((b) => b.type === 'PHONE_NUMBER').length > LIMITS.phoneButtons) add('error', 'Only one call button is allowed.');
    d.buttons.forEach((b, i) => {
        const label = `Button ${i + 1}`;
        if (!b.text.trim()) add('error', `${label} needs text.`);
        if (b.text.length > LIMITS.button) add('error', `${label} text is over ${LIMITS.button} characters.`);
        if (b.type === 'URL') {
            if (!/^https:\/\//i.test(b.value)) add('error', `${label}: the website must be a full link starting with https://`);
            if (SHORTENERS.test(b.value)) add('warning', `${label}: shortened links are commonly rejected.`);
            const uv = variablesIn(b.value);
            if (uv.length > 1) add('error', `${label}: a website button allows only one variable.`);
            if (uv.length === 1 && (!/\{\{\s*1\s*\}\}$/.test(b.value) || uv[0].inner !== '1')) add('error', `${label}: the variable must be {{1}} and sit at the very end of the link.`);
            if (uv.length === 1 && !b.example.trim()) add('error', `${label}: add an example link for the variable.`);
        }
        if (b.type === 'PHONE_NUMBER' && !/^\+\d{8,15}$/.test(b.value.replace(/[\s-]/g, ''))) add('error', `${label}: use an international number like +2348031234567.`);
    });
    // Meta wants buttons of the same kind grouped together (quick replies together, call-to-actions together).
    const kinds = d.buttons.map((b) => (b.type === 'QUICK_REPLY' ? 'Q' : 'C'));
    let switches = 0;
    for (let i = 1; i < kinds.length; i++) if (kinds[i] !== kinds[i - 1]) switches++;
    if (switches > 1) add('error', 'Group the buttons: put all quick replies together and all website/call buttons together.');

    // ── Samples ──
    const count = bodyVariableCount(body);
    for (let i = 0; i < count; i++) {
        if (!d.samples[i]?.trim()) add('error', `Add a sample value for {{${i + 1}}}. Meta requires one for every variable.`);
    }
    if (d.headerType === 'TEXT' && variablesIn(d.headerText).length === 1 && !d.headerExample.trim()) add('error', 'Add a sample value for the header variable.');

    return out;
}

/** Template in the shape Meta's Graph API (and Broadcast's template form) expects. */
export function toTemplateJson(d: Draft) {
    const components: Record<string, unknown>[] = [];
    if (d.headerType === 'TEXT' && d.headerText.trim()) {
        const hasVar = variablesIn(d.headerText).length === 1;
        components.push({ type: 'HEADER', format: 'TEXT', text: d.headerText, ...(hasVar && { example: { header_text: [d.headerExample] } }) });
    } else if (d.headerType !== 'NONE' && d.headerType !== 'TEXT') {
        components.push({ type: 'HEADER', format: d.headerType, example: { header_handle: ['<upload a sample file and paste its handle here>'] } });
    }
    const n = bodyVariableCount(d.body);
    components.push({
        type: 'BODY',
        text: d.body,
        ...(n > 0 && { example: { body_text: [Array.from({ length: n }, (_, i) => d.samples[i] || '')] } }),
    });
    if (d.footer.trim()) components.push({ type: 'FOOTER', text: d.footer });
    if (d.buttons.length) {
        components.push({
            type: 'BUTTONS',
            buttons: d.buttons.map((b) => {
                if (b.type === 'QUICK_REPLY') return { type: 'QUICK_REPLY', text: b.text };
                if (b.type === 'PHONE_NUMBER') return { type: 'PHONE_NUMBER', text: b.text, phone_number: b.value.replace(/[\s-]/g, '') };
                const dyn = variablesIn(b.value).length === 1;
                return { type: 'URL', text: b.text, url: b.value, ...(dyn && { example: [b.example] }) };
            }),
        });
    }
    return { name: d.name, language: d.language, category: d.category, components };
}

export const STARTERS: { label: string; draft: Partial<Draft> }[] = [
    {
        label: 'Order update',
        draft: { name: 'order_update', category: 'UTILITY', body: 'Hi {{1}}, your order {{2}} has been shipped and should arrive by {{3}}. Reply here if you have any questions.', samples: ['Ada', '#10452', 'Friday'], footer: 'Thanks for shopping with us' },
    },
    {
        label: 'Appointment reminder',
        draft: { name: 'appointment_reminder', category: 'UTILITY', body: 'Hello {{1}}, this is a reminder of your appointment on {{2}} at {{3}}. Please arrive 10 minutes early.', samples: ['Tunde', 'Monday 12 May', '10:30 AM'], buttons: [{ type: 'QUICK_REPLY', text: 'Confirm', value: '', example: '' }, { type: 'QUICK_REPLY', text: 'Reschedule', value: '', example: '' }] },
    },
    {
        label: 'Invoice ready',
        draft: { name: 'invoice_ready', category: 'UTILITY', headerType: 'DOCUMENT', body: 'Hello {{1}}, your invoice for {{2}} is attached. Please pay by {{3}} to avoid any interruption to your service.', samples: ['Ada', 'May 2026', '30 May'] },
    },
    {
        label: 'Promotion',
        draft: { name: 'weekend_promo', category: 'MARKETING', headerType: 'TEXT', headerText: 'Weekend sale 🎉', body: 'Hi {{1}}, enjoy 20% off everything this weekend only. Tap below to start shopping while stock lasts.', samples: ['Ada'], footer: 'Reply STOP to unsubscribe', buttons: [{ type: 'URL', text: 'Shop now', value: 'https://example.com/shop', example: '' }] },
    },
    {
        label: 'Welcome',
        draft: { name: 'welcome_new_customer', category: 'MARKETING', body: 'Welcome to our community, {{1}}! 👋 We are glad to have you. Save this number so you never miss an update from us.', samples: ['Ada'], footer: 'Reply STOP to unsubscribe' },
    },
];
