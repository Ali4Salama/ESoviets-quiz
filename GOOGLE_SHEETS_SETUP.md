# Google Sheets Setup Guide

Follow these steps to configure Google Sheets as the backend for the E-Soviets quiz.

## 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name: `E-Soviets Quiz` (or your preferred name)
4. Click "Create"

## 2. Enable Google Sheets API

1. In the Cloud Console, go to **APIs & Services** → **Library**
2. Search for "Google Sheets API"
3. Click on it → **Enable**

## 3. Create Service Account

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **Service Account**
3. Name: `e-soviets-sheets-writer`
4. Description: `Writes quiz responses to Google Sheets`
5. Click **Create and Continue**
6. Grant **Editor** role (optional but recommended)
7. Click **Done**

## 4. Generate Service Account Key

1. Click on the created service account
2. Go to **Keys** tab → **Add Key** → **Create new key**
3. Select **JSON** → **Create**
4. Save the downloaded JSON file securely

## 5. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet: "E-Soviets Responses"
3. In row 1, add these 28 headers (exact order matters):

```
timestamp, participant_id, nickname, email, country, proposal_position, motivation_interests, weekly_availability, skills, experience_level, portfolio_url, social_x, social_instagram, social_telegram, social_tiktok, social_link, preferred_soviet, secondary_soviets, delegate_interest, delegate_motivations, proposal_text, ai_robotics_proposal, first_month_actions, participation_modes, consent_contact, confirm_accuracy, public_profile_consent, user_agent
```

4. Rename the sheet tab to `Responses` (or your preferred name)

## 6. Share Sheet with Service Account

1. In the Google Sheet, click **Share** (top-right)
2. Add the service account email (from the JSON key, field `client_email`)
3. Permission: **Editor**
4. Uncheck "Notify people"
5. Click **Share**

## 7. Get Sheet ID

From the sheet URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

Copy the `{SHEET_ID}` part.

## 8. Configure Environment Variables

### Local Development (`.env.local`)

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SHEET_NAME=Responses
```

**Important**: The private key must preserve newlines. Copy the `private_key` field from the JSON exactly as shown (with `\n` or actual newlines).

### Vercel Production

In Vercel dashboard → Project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | (from JSON) |
| `GOOGLE_PRIVATE_KEY` | (from JSON, with actual newlines) |
| `GOOGLE_SHEET_ID` | (from sheet URL) |
| `GOOGLE_SHEET_NAME` | `Responses` |

## 9. Deploy & Test

1. Deploy to Vercel (see [Vercel Deploy Guide](VERCEL_DEPLOY.md))
2. Open the deployed URL
3. Complete the questionnaire
4. Submit
5. Check the Google Sheet - a new row should appear with your response

## Troubleshooting

**"Missing Google Sheets environment variables"**
- Verify all 4 env vars are set in Vercel
- Check for typos in variable names

**"We couldn't save your response"**
- Check Vercel function logs for details
- Verify service account has Editor access to the sheet
- Ensure Sheets API is enabled

**Private key format issues**
- The key must include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Newlines must be preserved (use actual newlines in Vercel dashboard, not `\n`)

**Sheet not found**
- Verify `GOOGLE_SHEET_ID` matches the sheet URL
- Verify `GOOGLE_SHEET_NAME` matches the tab name exactly (`Responses`)

## Security Notes

- Never commit `.env.local` or service account JSON to git
- The `.gitignore` excludes `.env*` files
- Rotate service account keys periodically
- Use least-privilege: only grant Editor on the specific sheet