
# Kitabu Yetu | Google Sheets Database Schema

This application uses Google Sheets as a production-grade database. The `Code.gs` script automatically initializes the schema, but you should verify the following structure for native reporting.

## 1. Primary Data Store (Application State)
**Sheet Name:** `DataStore`
Stores the full React state for rapid hydration.
- **Column A:** Key Name (`AppState_Master`)
- **Column B:** JSON Payload (Full encrypted/structured state)
- **Column C:** Last Sync Timestamp

## 2. Reporting Sheets (Flattened for NGO Admins)
These sheets are automatically updated by the app. Do not manually edit them if you want the "Live" data to remain consistent.

### Members Table
`memberKyId`, `firstName`, `lastName`, `phone`, `nationalId`, `role`, `gender`, `status`, `vslaId`

### Transactions Table (Livelihood Ledger)
`id`, `date`, `type`, `amount`, `memberId`, `vslaId`, `description`, `recordedBy`

### VSLAs Table
`id`, `name`, `village`, `ward`, `county`, `status`, `inviteCode`

### Audit Logs
`id`, `timestamp`, `userId`, `action`, `details`

---

## Troubleshooting 'Index Not Found' Exception
If you see the error `Exception: No HTML file named index was found`:
1.  **File Naming:** In the Google Apps Script Editor, your HTML file must be named **exactly** `index.html`. 
2.  **Extension:** Do not name it `index.tsx` inside the GAS editor. GAS only supports `.gs` and `.html`.
3.  **Template Engine:** Ensure `doGet` is calling `createTemplateFromFile('index')` (without the .html extension).

## Deployment Instructions
1.  Open a new Google Sheet.
2.  Go to **Extensions > Apps Script**.
3.  Copy `Code.gs` into the editor.
4.  Create a new HTML file in the editor and name it `index`. Copy the contents of your `index.html` into it.
5.  Go to **Project Settings > Script Properties** and add `API_KEY` (Your Gemini API Key).
6.  Click **Deploy > New Deployment**.
7.  Select **Web App**, set access to **Anyone**, and execute as **Me**.
