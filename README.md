# Lapse landing page

Static page, zero build step: `index.html` + `styles.css` + `script.js`. Deploy by pointing
a static host at this folder.

## Status

Live at Netlify (see GAM-9 for the URL). Source of truth for this page lives in this repo
(`ugudlado/lapse-landing`); the sibling `_default` Paperclip workspace copy is stale after this push.

## Remaining setup

1. **Waitlist backend** — deploy `apps-script/Code.gs` as a Google Apps Script web app (steps in
   that file's header comment), then paste the `/exec` URL into `WAITLIST_ENDPOINT` in `script.js`.
   Blocked on the Google Sheets connection (requested, pending approval) or any Google account with
   Sheets + Apps Script access.
2. **GA4** — create a GA4 property (no Paperclip connection type exists for Google Analytics;
   this has to be done by hand in the Analytics admin console) and swap the two `G-XXXXXXXXXX`
   placeholders in `index.html` for the real Measurement ID.
3. **Play Store link** — set `PLAY_STORE_PACKAGE` in `script.js` once the app is live. The
   referrer query param is already wired (see `wirePlayStoreLink` in `script.js`); this is a
   one-line swap, not a redesign.
4. **Social + contact links** — placeholders in the footer (`twitter.com/lapseapp`,
   `t.me/lapseapp`, `reddit.com/r/lapseapp`, `hello@lapse.app`). Swap for real handles once Nia
   sets them up.
