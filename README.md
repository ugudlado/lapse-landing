# Lapse landing page

Static page, zero build step: `index.html` + `styles.css` + `script.js`. Deploy by pointing
a static host at this folder.

## Remaining setup (see GAM-9)

1. **Hosting** — deployed to Netlify (`lapse-landing.netlify.app`), same precedent as the Weave
   landing page in this workspace. `*.vercel.app` wasn't available (no Vercel connection in
   Paperclip's catalog).
2. **Waitlist backend** — uses [Netlify Forms](https://docs.netlify.com/manage/forms/setup/),
   not a Google Sheet. Both `.waitlist-form` forms carry `data-netlify="true"` and a `form-name`
   field; Netlify's build-time HTML parser detects them automatically as long as that markup
   stays in the deployed HTML (don't strip it during any future build-step migration). Submissions
   land in the site's Netlify Forms dashboard with `email`, `utm_source`, `utm_medium`,
   `utm_campaign`, and `location` (hero/footer) columns per row — the same attribution data the
   spec asked for, with zero extra connection or backend to deploy. Export to CSV from that
   dashboard if a spreadsheet view is ever needed. A hidden honeypot field (`bot-field`) provides
   basic spam filtering at no cost.
3. **GA4** — create a GA4 property (no Paperclip connection type exists for Google Analytics;
   this has to be done by hand in the Analytics admin console) and swap the two `G-XXXXXXXXXX`
   placeholders in `index.html` for the real Measurement ID.
4. **Play Store link** — set `PLAY_STORE_PACKAGE` in `script.js` once the app is live. The
   referrer query param is already wired (see `wirePlayStoreLink` in `script.js`); this is a
   one-line swap, not a redesign.
5. **Social + contact links** — placeholders in the footer (`twitter.com/lapseapp`,
   `t.me/lapseapp`, `reddit.com/r/lapseapp`, `hello@lapse.app`). Swap for real handles once Nia
   sets them up.
