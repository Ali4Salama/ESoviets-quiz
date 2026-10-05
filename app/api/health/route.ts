import { NextResponse } from 'next/server';
import { getSheetsConfigStatus } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

// Reports whether the Sheets backend is configured. Only boolean flags are
// exposed here — never secret values. Open this URL in a browser to check
// production: https://<your-app>.vercel.app/api/health
export async function GET() {
  const sheets = getSheetsConfigStatus();
  const ok = sheets.serviceAccountEmailSet && sheets.privateKeySet && sheets.sheetIdSet;

  return NextResponse.json({
    ok,
    sheets,
    hint: ok
      ? 'Config present. If rows still do not appear, verify the spreadsheet ID, the tab name, and that the service account has Editor access.'
      : 'Sheets config incomplete. Set the missing env vars (see GOOGLE_SHEETS_SETUP.md) and redeploy.',
  });
}
