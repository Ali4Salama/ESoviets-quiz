# Vercel Deployment Guide

Deploy the E-Soviets Quiz to Vercel's free tier.

## Prerequisites

- GitHub account
- Vercel account (free at [vercel.com](https://vercel.com))
- Google Cloud project with Sheets API configured (see [Google Sheets Setup](GOOGLE_SHEETS_SETUP.md))
- Code pushed to a GitHub repository

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd e-soviets-quiz
git init
git add .
git commit -m "Initial E-Soviets quiz"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/e-soviets-quiz.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your GitHub repository
4. Vercel auto-detects Next.js - keep defaults
5. Click **Deploy** (we'll add env vars first)

### 3. Configure Environment Variables

**Before the first deploy**, add these in Vercel:

1. In project settings → **Environment Variables**
2. Add each variable:

| Name | Value | Environment |
|------|-------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `your-sa@project.iam.gserviceaccount.com` | Production, Preview, Development |
| `GOOGLE_PRIVATE_KEY` | (paste entire key with newlines) | Production, Preview, Development |
| `GOOGLE_SHEET_ID` | `1ABC...` (from sheet URL) | Production, Preview, Development |
| `GOOGLE_SHEET_NAME` | `Responses` | Production, Preview, Development |

**Important**: For `GOOGLE_PRIVATE_KEY`, paste the key with **actual newlines** (not `\n`). In Vercel dashboard, press Enter for newlines.

### 4. Deploy

1. After adding env vars, click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. Vercel provides a URL like `https://e-soviets-quiz.vercel.app`

### 5. Verify

1. Open the deployed URL
2. Complete a test questionnaire
3. Submit
4. Check Google Sheets - new row should appear
5. Download/share the participant card

## Vercel Configuration

The project includes `vercel.json` to extend the API function timeout:

```json
{
  "functions": {
    "app/api/submit/route.ts": {
      "maxDuration": 30
    }
  }
}
```

This allows 30 seconds for Google Sheets API calls (default is 10s).

## Custom Domain (Optional)

1. In Vercel project → **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed
4. SSL auto-provisioned

## Environment-Specific Variables

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `GOOGLE_SHEET_ID` | Test sheet ID | Test sheet ID | Production sheet ID |
| `GOOGLE_SHEET_NAME` | `Responses` | `Responses` | `Responses` |

Use separate Google Sheets for dev/preview/prod to keep data clean.

## Troubleshooting

### Build Fails

- **TypeScript errors**: Run `npm run build` locally first
- **Missing env vars**: Check all 4 variables in Vercel settings
- **Function timeout**: `vercel.json` sets 30s; Sheets API usually <5s

### API Route Returns 500

- Check Vercel **Functions** → **Logs** for errors
- Common: Service account lacks sheet access, Sheets API not enabled
- Verify private key format (newlines preserved)

### Google Sheets Not Updated

- Service account email must have Editor access on the sheet
- Sheet tab name must match `GOOGLE_SHEET_NAME` exactly
- Check function logs for API errors

### Rate Limited (429)

- In-memory rate limit: 10 req/min per IP
- Resets on function cold start (serverless)
- For production, consider Vercel KV for persistent rate limiting

## Security Checklist

- [ ] `.env.local` not committed (in `.gitignore`)
- [ ] Service account key not in repo
- [ ] Only necessary env vars in Vercel
- [ ] Service account has minimal permissions (Editor on one sheet)
- [ ] No credentials in client bundle (verify in browser dev tools)

## Monitoring

- Vercel **Analytics** → page views, performance
- **Functions** → API latency, errors, invocations
- **Logs** → real-time function logs

## Rollback

1. Vercel Dashboard → **Deployments**
2. Click **...** on previous deployment → **Promote to Production**

## Costs

- **Vercel Free Tier**: 100GB bandwidth, 1000 serverless function executions/month
- **Google Sheets API**: Free (generous quotas)
- **Total**: $0/month for typical usage

## Support

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Google Sheets API: [developers.google.com/sheets](https://developers.google.com/sheets/api)