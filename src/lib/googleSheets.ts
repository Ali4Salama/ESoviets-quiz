import { google, sheets_v4 } from 'googleapis';

let sheetsClient: sheets_v4.Sheets | null = null;

function getSheetsClient(): sheets_v4.Sheets {
  if (sheetsClient) return sheetsClient;

  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const missing = [
    !serviceAccountEmail && 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    !privateKey && 'GOOGLE_PRIVATE_KEY',
    !sheetId && 'GOOGLE_SHEET_ID',
  ].filter(Boolean);
  if (missing.length > 0) {
    throw new Error(`Missing Google Sheets environment variables: ${missing.join(', ')}`);
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

export const EXPECTED_COLUMN_COUNT = 28;

export function getSheetsConfigStatus() {
  return {
    serviceAccountEmailSet: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
    privateKeySet: Boolean(process.env.GOOGLE_PRIVATE_KEY),
    sheetIdSet: Boolean(process.env.GOOGLE_SHEET_ID),
    sheetName: process.env.GOOGLE_SHEET_NAME || 'Responses',
    expectedColumns: EXPECTED_COLUMN_COUNT,
  };
}

export async function appendToSheet(row: string[]): Promise<void> {
  const sheetId = process.env.GOOGLE_SHEET_ID!;
  const sheetName = process.env.GOOGLE_SHEET_NAME || 'Responses';

  if (row.length !== EXPECTED_COLUMN_COUNT) {
    console.error(`Sheets row has ${row.length} columns, expected ${EXPECTED_COLUMN_COUNT}. Check formatRowForSheets.`);
  }

  const sheets = getSheetsClient();

  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${sheetName}!A:AB`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    });
    console.log(`Appended ${res.data.updates?.updatedCells ?? '?'} cells to sheet tab "${sheetName}".`);
  } catch (error) {
    const err = error as { code?: number; message?: string; response?: { data?: unknown } };
    console.error('Google Sheets append failed:', {
      code: err.code,
      message: err.message,
      sheetName,
      rowColumns: row.length,
      response: err.response?.data,
    });
    throw error;
  }
}