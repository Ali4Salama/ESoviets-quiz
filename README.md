# E-Soviets Quiz

A participant intake questionnaire for the E-Soviets digital organization proposal. Collects interest, skills, availability, preferred Soviet, and project proposals from potential participants.

> **Important**: This application collects participant interest and organizational information. Completing the questionnaire does not itself appoint a participant as a delegate or representative.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Environment Variables

Create a `.env.local` file with the following variables (see `.env.example`):

| Variable | Description |
|----------|-------------|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email from Google Cloud |
| `GOOGLE_PRIVATE_KEY` | Service account private key (with newlines) |
| `GOOGLE_SHEET_ID` | Google Sheet ID from URL |
| `GOOGLE_SHEET_NAME` | Sheet tab name (default: `Responses`) |

## Setup Guides

- [Google Sheets Setup](GOOGLE_SHEETS_SETUP.md) - Configure Google Cloud & Sheets
- [Vercel Deployment](VERCEL_DEPLOY.md) - Deploy to Vercel

## Project Structure

```
e-soviets-quiz/
├── app/
│   ├── page.tsx              # Landing page
│   ├── quiz/page.tsx         # Multi-step questionnaire
│   ├── result/page.tsx       # Participant card display
│   └── api/submit/route.ts   # Submission API endpoint
├── components/
│   ├── QuizProgress.tsx      # Progress indicator
│   ├── QuestionCard.tsx      # Question wrapper
│   ├── SingleSelect.tsx      # Radio button group
│   ├── MultiSelect.tsx       # Checkbox group (categorized)
│   ├── TextQuestion.tsx      # Textarea with char counter
│   ├── ParticipantCard.tsx   # SVG card generator
│   └── SovietsGrid.tsx       # Landing page Soviet cards
├── lib/
│   ├── googleSheets.ts       # Sheets API client
│   ├── participantId.ts      # ID generator
│   ├── validation.ts         # Zod schemas
│   └── quizSchema.ts         # TypeScript types
├── public/
├── .env.example
├── vercel.json
└── package.json
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Storage**: Google Sheets API
- **Deployment**: Vercel
- **Image Generation**: SVG + Canvas API

## Features

- 15-step questionnaire with progress tracking
- Conditional questions (delegate motivations)
- Categorized skills selection (5 categories, max 15)
- Server-side validation & sanitization
- Unique participant IDs (`ES-2026-XXXXXX`)
- Participant card generation (SVG → PNG)
- Download & share (Web Share API + fallback)
- Rate limiting & honeypot anti-spam
- WCAG AA accessibility
- Dark theme with red accent

## Deployment

See [Vercel Deployment Guide](VERCEL_DEPLOY.md) for step-by-step instructions.

## License

MIT