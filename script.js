// TODO(growth): set this to the deployed Apps Script web app "exec" URL once
// apps-script/Code.gs is deployed (Deploy > New deployment > Web app, access: Anyone).
// See apps-script/README.md for the deploy steps. Form submits are inert until this is set.
const WAITLIST_ENDPOINT = "";

// TODO(mobile): set this to the real Play Store package name once Lapse is published,
// e.g. "com.gamada.lapse". Until set, the Play Store link stays hidden (see index.html).
const PLAY_STORE_PACKAGE = "";

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
  };
}

function fillHiddenUtmFields(form, utm) {
  form.querySelector('[name="utm_source"]').value = utm.utm_source;
  form.querySelector('[name="utm_medium"]').value = utm.utm_medium;
  form.querySelector('[name="utm_campaign"]').value = utm.utm_campaign;
}

function wirePlayStoreLink(utm) {
  if (!PLAY_STORE_PACKAGE) return; // stays hidden pre-launch, see index.html inline style
  const link = document.getElementById("play-store-link");
  if (!link) return;

  const referrer = new URLSearchParams({
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
  }).toString();

  const base = `https://play.google.com/store/apps/details?id=${encodeURIComponent(PLAY_STORE_PACKAGE)}`;
  link.href = referrer ? `${base}&referrer=${encodeURIComponent(referrer)}` : base;
  link.style.display = "";
}

function setStatus(form, state, message) {
  const status = form.querySelector(".form-status");
  status.textContent = message;
  status.dataset.state = state;
}

async function submitWaitlist(form, utm) {
  const email = form.querySelector('[name="email"]').value.trim();
  const button = form.querySelector("button");

  if (!WAITLIST_ENDPOINT) {
    setStatus(form, "error", "Signups aren't wired up yet — check back soon.");
    return;
  }

  button.disabled = true;
  setStatus(form, "pending", "Submitting…");

  try {
    // Apps Script web apps don't return CORS headers for simple POSTs read back
    // client-side, so this fires as a no-cors request: we can't read the response body,
    // but the row still lands in the Sheet. Treat "the fetch didn't throw" as success.
    await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, ...utm }).toString(),
    });

    setStatus(form, "ok", "You're on the list!");
    form.reset();
    fillHiddenUtmFields(form, utm);

    if (typeof gtag === "function") {
      gtag("event", "generate_lead", {
        form_location: form.dataset.location,
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });
    }
  } catch (err) {
    setStatus(form, "error", "Something went wrong — try again in a moment.");
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const utm = getUtmParams();
  const forms = document.querySelectorAll(".waitlist-form");

  forms.forEach((form) => {
    fillHiddenUtmFields(form, utm);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitWaitlist(form, utm);
    });
  });

  wirePlayStoreLink(utm);
});
