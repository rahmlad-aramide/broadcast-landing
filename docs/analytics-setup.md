# Analytics setup (Google Analytics 4 + cookie consent)

The landing site already contains everything needed on the code side. **Nothing runs and no
cookie notice shows until you complete step 3.** Until then the site has no analytics.

## How it works (so you know what you're switching on)

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` unset → no analytics, no notice, nothing to consent to.
- Set → analytics loads **by default** on every page (using the site implies consent), and
  first-time visitors see a notice: "By using this website, you consent to our use of cookies…"
  with a single **OK** button. Clicking OK just dismisses the notice.
- The ID can be a GA4 measurement ID (`G-XXXXXXXXXX`, loaded via `gtag.js`) or a Tag Manager
  container (`GTM-XXXXXXX`, loaded via the GTM bootstrap). The code detects which from the prefix.
- A visitor can still **opt out** from the footer's **Cookie Settings** (or the Cookie Policy page):
  turning Analytics off stops Google Analytics immediately and clears its cookies.
- The choice (OK or opt-out) is stored 12 months in a `cookie_consent` cookie on `.broadcast.com.ng`.
- Code: `lib/consent.ts`, `context/ConsentContext.tsx`, `components/CookieConsent.tsx`.

## Steps you need to do

### 1. Create the Google Analytics property
1. Go to <https://analytics.google.com> and sign in with the Google account that should own the data
   (use a shared/company account, not a personal one you might lose).
2. **Admin → Create → Property.** Name: `Broadcast`, time zone **Africa/Lagos**, currency **NGN**.
3. Choose your business details, then pick the goals closest to "Generate leads" / "Examine user behavior".

### 2. Add a web data stream
1. **Admin → Data collection and modification → Data streams → Add stream → Web.**
2. URL: `https://broadcast.com.ng` — stream name `Broadcast website`.
3. Leave **Enhanced measurement** on (page views, scrolls, outbound clicks, file downloads).
4. Copy the **Measurement ID** (looks like `G-XXXXXXXXXX`).

### 3. Turn it on in the site
1. In your hosting dashboard (Vercel → Project → Settings → Environment Variables) add:
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` for **Production** (add Preview only if you want
   test deploys counted; usually don't).
2. **Redeploy.** This variable is read at build time, so it has no effect until the next build.
3. Locally: copy `.env.example` to `.env.local`, set the same variable, run `npm run dev`.

### 4. Verify it works (and respects consent)
1. Open the site in a **private window**. The cookie notice (with the OK button) should appear.
2. Without clicking anything, open DevTools → Network and confirm a request to
   `googletagmanager.com` (`gtag/js` for a `G-` ID, `gtm.js` for a `GTM-` ID) and `_ga` cookies
   (Application → Cookies). Analytics is on by default.
3. Click **OK**. The notice disappears; analytics keeps running.
4. In Google Analytics → **Reports → Realtime** you should see yourself within a minute
   (use **Admin → DebugView** for per-event detail).
5. Click **Cookie Settings** in the footer, turn Analytics off, save. Confirm the `_ga` cookies are removed.
6. Reload with Analytics switched off: no Google requests and no `_ga` cookies.
7. Google's own "Test" button in Analytics/Tag Manager should now detect the tag on
   `broadcast.com.ng`, since it no longer waits for a click.

### 5. Recommended GA settings
- **Admin → Data collection → Data retention:** set event data retention to **14 months** (default is 2).
- **Admin → Data collection → Google signals:** leave **off** unless you plan to use ads remarketing;
  it expands what's collected and your consent wording.
- **Admin → Data streams → (stream) → Configure tag settings → Configure your domains:** add
  `broadcast.com.ng` and `app.broadcast.com.ng` so visits to both are treated as one session.
- **Admin → Data streams → (stream) → Enhanced measurement:** keep Outbound clicks on; it will
  show clicks to the app's signup page.
- Mark the events that matter as **Key events** (Admin → Events): see "What to measure" below.

### 6. Before you go live, update your documents
- **Cookie Policy** (`/cookie-policy`) already lists the Google Analytics cookies (`_ga`, `_ga_<ID>`).
- **Privacy Policy**: add a short section saying you use Google Analytics, what it collects
  (pages visited, device/browser, approximate location, referrer), that it runs by default when
  someone uses the site, and how to opt out. (The current text predates analytics and is written about schools; worth a review.)
- Keep the **cookie notice wording** and policy in sync if you ever add another tool.

## What to measure (suggested)
The signup call-to-action links go to the app (`https://app.broadcast.com.ng/signup`), so you'll
see them as **outbound clicks** automatically. Useful extras once the basics are working:
- Click on "Get Started" / "Request Custom Setup" / pricing plan buttons (custom events).
- Contact form submitted successfully.
- FAQ opened.
Ask for these when you want them; each is a one-line `gtag('event', …)` call (or `dataLayer.push` if using Tag Manager) that
should respect the visitor's opt-out.

## Tracking inside the app (optional, later)
`app.broadcast.com.ng` has **no analytics**. If you want to measure signup → payment → first
campaign, the app must (a) read the same `cookie_consent` cookie, and (b) load the tag unless it
is `essential` (the opt-out value). Don't add a tag to the app without that, or the consent choice made on the landing site
won't be honoured. Ask when you want it built.

## Alternatives (if GA4 feels heavy)
Cookieless tools (Plausible, Umami, Fathom) don't set cookies or process personal data, so **no
consent notice is required**, they're lighter and simpler, but give less detail and don't feed Google
Ads. If you switch, the notice and consent code can be removed and the Cookie Policy table trimmed.

## Compliance notes
- Analytics is **on by default**, with an implied-consent notice ("by using this website, you
  consent…") and an opt-out in the footer. This is a deliberate choice for simplicity and so Google's
  tag checker can detect the tag. It is **not** the opt-in model regulators generally expect: GDPR/
  ePrivacy (EU/UK visitors) and Nigeria's NDPA typically require consent *before* non-essential
  analytics cookies are set, and "by using this site" is usually not accepted as valid consent.
  If you get meaningful EU/UK traffic, or run ads, consider reverting to opt-in (Accept/Reject,
  analytics loads only after Accept) or Google Consent Mode.
- The opt-out choice is remembered for 12 months and can be changed any time from the footer.
- This is a practical setup, not legal advice; have your privacy policy reviewed if you handle
  EU/UK visitors or run ads.

## Troubleshooting
| Symptom | Likely cause |
|---|---|
| No notice appears | `NEXT_PUBLIC_GA_MEASUREMENT_ID` not set at **build** time, or you already clicked OK (clear the `cookie_consent` cookie) |
| Notice shows but nothing in Realtime | Ad blocker; analytics opted out in Cookie Settings; wrong ID; for a `GTM-` ID, the container has no GA4 Configuration tag firing on All Pages |
| Notice appears again every visit | Cookies blocked in the browser; or testing on a domain that isn't `*.broadcast.com.ng` |
| Works locally, not in production | Env var added to the wrong environment, or no redeploy after adding it |
