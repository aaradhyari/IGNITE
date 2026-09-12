// ============================================================
// IGNITE — Registration configuration
// ------------------------------------------------------------
// Architecture: React frontend → Google Apps Script Web App → Google Sheets
//
// To enable registrations, deploy a Google Apps Script as a Web App
// (accessible to "Anyone") that accepts a POST with the form payload and
// appends a row to a Google Sheet. Then paste that deployment URL below.
//
// No private credentials are exposed in this file.
// ============================================================

export const REGISTRATION_API_URL = 'https://script.google.com/macros/s/AKfycbxmp1SbBlJEiasntto_LTwALxo010w6LraZaMtJHHU39aGhTvNp8UOrG-rdsJmtU71Y/exec'

// Convenience flag used by the form to detect an unconfigured deployment.
export const isRegistrationConfigured = () =>
  typeof REGISTRATION_API_URL === 'string' &&
  REGISTRATION_API_URL.startsWith('https://') &&
  !REGISTRATION_API_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_URL')

export const REGISTRATION_CONTACT = 'TO BE ANNOUNCED'
