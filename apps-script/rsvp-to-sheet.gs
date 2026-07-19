/**
 * RSVP → Google Sheet receiver.
 *
 * SETUP (see README.md for full walkthrough):
 * 1. Create a new Google Sheet. Rename the first tab to exactly: RSVP
 * 2. In the Sheet: Extensions → Apps Script.
 * 3. Delete any starter code, paste this file's contents in, and save.
 * 4. Deploy → New deployment → type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web App URL it gives you (ends in /exec).
 * 6. Put that URL in your project's .env.local as NEXT_PUBLIC_RSVP_ENDPOINT.
 */

function doPost(e) {
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName("RSVP") ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet("RSVP");

  // Add header row once, if the sheet is empty.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Submitted At",
      "Attending",
      "Name",
      "Email",
      "Guests",
      "Dietary",
      "Message",
    ]);
  }

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    new Date(),
    data.attending || "",
    data.name || "",
    data.email || "",
    data.guests || "",
    data.dietary || "",
    data.message || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
