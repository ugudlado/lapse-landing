// Lapse waitlist capture — Google Apps Script web app.
//
// Setup:
// 1. Create a Google Sheet (e.g. "Lapse Waitlist").
// 2. Extensions > Apps Script, paste this file in as Code.gs.
// 3. Run setupHeaderRow once from the editor to create the header row (grants Sheets access).
// 4. Deploy > New deployment > type "Web app", execute as "Me", access "Anyone".
// 5. Copy the deployment's /exec URL into WAITLIST_ENDPOINT in ../script.js.

const SHEET_NAME = "Waitlist";
const HEADERS = ["timestamp", "email", "utm_source", "utm_medium", "utm_campaign"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

function setupHeaderRow() {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
}

function doPost(e) {
  const sheet = getSheet_();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  const params = (e && e.parameter) || {};
  const email = (params.email || "").trim();

  if (!email) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: "email required" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  sheet.appendRow([
    new Date(),
    email,
    params.utm_source || "",
    params.utm_medium || "",
    params.utm_campaign || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
