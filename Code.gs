
/**
 * Kitabu Yetu - Google Apps Script Production Backend
 * Handles Google Sheets persistence and serves the React frontend.
 */

function doGet(e) {
  try {
    // Initialize database structure
    checkAndInitSheets();
    
    // Attempt to render index.html from the project files
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('Kitabu Yetu | Digital VSLA Ledger')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
        .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
  } catch (err) {
    // Graceful error if index.html is missing in the GAS Editor
    return HtmlService.createHtmlOutput(
      "<h1>Deployment Configuration Error</h1>" +
      "<p>The script could not find a file named <b>index.html</b>.</p>" +
      "<p><b>Solution:</b> In the Apps Script Editor, click the '+' next to Files, select 'HTML', and name it <b>index</b>.</p>" +
      "<p style='color:red;'>Error details: " + err.message + "</p>"
    );
  }
}

/**
 * Provides the Frontend with the API Key and Environment context.
 * Set your key in Project Settings > Script Properties as 'API_KEY'.
 */
function getEnvConfig() {
  const scriptProps = PropertiesService.getScriptProperties();
  return {
    API_KEY: scriptProps.getProperty('API_KEY') || "",
    isProduction: true,
    sheetUrl: SpreadsheetApp.getActiveSpreadsheet().getUrl()
  };
}

/**
 * Initializes the Google Sheet schema if tabs are missing.
 */
function checkAndInitSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = {
    'DataStore': [['Key', 'Value', 'LastUpdated']],
    'Members': [['memberKyId', 'firstName', 'lastName', 'phone', 'nationalId', 'role', 'gender', 'status', 'vslaId']],
    'Transactions': [['id', 'date', 'type', 'amount', 'memberId', 'vslaId', 'description', 'recordedBy']],
    'VSLAs': [['id', 'name', 'village', 'ward', 'county', 'status', 'inviteCode']],
    'AuditLogs': [['id', 'timestamp', 'userId', 'action', 'details']]
  };
  
  Object.keys(sheets).forEach(name => {
    if (!ss.getSheetByName(name)) {
      const newSheet = ss.insertSheet(name);
      newSheet.getRange(1, 1, 1, sheets[name][0].length)
              .setValues([sheets[name][0]])
              .setFontWeight('bold')
              .setBackground('#f8fafc');
      ss.setFrozenRows(1);
    }
  });
}

/**
 * Saves the Application State to Google Sheets.
 */
function saveAppData(stateJson) {
  if (!stateJson) throw new Error("Empty state payload received.");
  
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const state = JSON.parse(stateJson);
    
    // 1. Update Master JSON State
    const storeSheet = ss.getSheetByName('DataStore');
    storeSheet.getRange('A2:C2').setValues([['AppState_Master', stateJson, new Date()]]);

    // 2. Refresh Human-Readable Reporting Tables
    updateEntitySheet(ss, 'Members', state.members || []);
    updateEntitySheet(ss, 'Transactions', state.transactions || []);
    updateEntitySheet(ss, 'VSLAs', state.vslas || []);

    return { status: 'success', timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Save Error:', error.message);
    throw new Error('Persistence failure: ' + error.message);
  }
}

function getAppData() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const storeSheet = ss.getSheetByName('DataStore');
    if (!storeSheet) return null;
    return storeSheet.getRange('B2').getValue() || null;
  } catch (e) {
    return null;
  }
}

function updateEntitySheet(ss, name, dataArray) {
  const sheet = ss.getSheetByName(name);
  if (!sheet || dataArray.length === 0) return;
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rows = dataArray.map(obj => headers.map(h => {
    const val = obj[h];
    return (val === null || val === undefined) ? '' : (typeof val === 'object' ? JSON.stringify(val) : val);
  }));
  
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, headers.length).clearContent();
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}
