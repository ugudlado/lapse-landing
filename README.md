# Lapse landing page

Static page, zero build step: `index.html` + `styles.css` + `script.js`. Deploy by pointing
a static host at this folder.

## Remaining setup (see GAM-9)

1. **Hosting** — deployed to Netlify (`lapse-landing.netlify.app`), same precedent as the Weave
   landing page in this workspace. `*.vercel.app` wasn't available (no Vercel connection in
   Paperclip's catalog). This is its own standalone repo (`github.com/ugudlado/lapse-landing`),
   not part of the Lapse app repo, and the code is plain static HTML/CSS/JS with no host-specific
   build step — so it can be pointed at any custom domain from the Netlify dashboard (Site
   settings → Domain management → Add a domain) once DNS is chosen, or deployed to a different
   static host entirely without code changes.
2. **Waitlist backend** — uses [Netlify Forms](https://docs.netlify.com/manage/forms/setup/),
   not a Google Sheet. Both `.waitlist-form` forms carry `data-netlify="true"` and a `form-name`
   field; Netlify's build-time HTML parser detects them automatically as long as that markup
   stays in the deployed HTML (don't strip it during any future build-step migration). Submissions
   land in the site's Netlify Forms dashboard with `email`, `utm_source`, `utm_medium`,
   `utm_campaign`, and `location` (hero/footer) columns per row — the same attribution data the
   spec asked for, with zero extra connection or backend to deploy. Export to CSV from that
   dashboard if a spreadsheet view is ever needed. A hidden honeypot field (`bot-field`) provides
   basic spam filtering at no cost.
3. **PostHog** — connected. `index.html` carries a live token (`phc_rqwFv5f...`). A dedicated
   "Lapse" project was requested but the org's PostHog plan caps it at 1 project (`project-create`
   returned a 403 plan-limit error) — upgrading is a billing decision outside mobile-eng scope, so
   this is flagged on GAM-9 rather than silently paid for. Using the shared default project
   instead: `posthog.register({ app: 'lapse' })` runs right after `posthog.init` so every event
   (autocaptured pageviews + the `generate_lead` event in `script.js`) carries `app=lapse` and
   stays filterable once Weave's landing page starts sending events into the same project. Revisit
   and split into a real per-app project if/when the plan is upgraded. If the project ever moves
   off PostHog Cloud US, also update `api_host`.
4. **Play Store link** — set `PLAY_STORE_PACKAGE` in `script.js` once the app is live. The
   referrer query param is already wired (see `wirePlayStoreLink` in `script.js`); this is a
   one-line swap, not a redesign.
5. **Social + contact links** — placeholders in the footer (`twitter.com/lapseapp`,
   `t.me/lapseapp`, `reddit.com/r/lapseapp`, `hello@lapse.app`). Swap for real handles once Nia
   sets them up.
