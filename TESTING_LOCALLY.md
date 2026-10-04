# Testing Locally Before Deploy

## Prerequisites

1. **Node.js 18+** installed
2. **Google Cloud Project** with Sheets API enabled
3. **Service Account** with JSON key
4. **Google Sheet** created and shared with service account

---

## 1. Environment Setup

```bash
cd e-soviets-quiz

# Copy example env file
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

**Required `.env.local` values:**
```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-sa@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your_sheet_id_from_url
GOOGLE_SHEET_NAME=Responses
```

> **Important**: The private key must preserve newlines. Use actual newlines in the file (not `\n` literal).

---

## 2. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:3000

---

## 3. Manual Test Checklist

### Landing Page (`/`)
- [ ] Hero displays "E-SOVIETS" + "Organize. Discuss. Build."
- [ ] Body text matches spec
- [ ] Primary CTA "Join the questionnaire" → `/quiz`
- [ ] Secondary CTA "Read the proposal" → external link (new tab)
- [ ] All 6 Soviet cards render with names, short names, work items
- [ ] Responsive: 1 col mobile, 2 tablet, 3 desktop
- [ ] Footer disclaimer visible

### Quiz Flow (`/quiz`)

#### Step 1: Basic Identity
- [ ] Nickname: 2-30 chars, alphanumeric + spaces + `_` `-`
- [ ] Email: valid format required
- [ ] Helper text: "Your email will be used only for project communication..."
- [ ] Required validation works
- [ ] Back button hidden

#### Step 2: Proposal Position
- [ ] 6 radio options (A-F) render
- [ ] Single selection works
- [ ] Required validation

#### Step 3: Motivation Interests
- [ ] 12 checkbox options
- [ ] Multi-select, max 5
- [ ] Counter shows "X/5 selected"
- [ ] Disabled when max reached
- [ ] Required (at least 1)

#### Step 4: Weekly Availability
- [ ] 8 radio options
- [ ] Single selection
- [ ] Required

#### Step 5: Skills
- [ ] 5 categories expanded by default
- [ ] All skills listed per category
- [ ] Max 15 total, counter "X/15"
- [ ] Disabled when max reached
- [ ] Required (at least 1)

#### Step 6: Experience
- [ ] 6 radio options for experience level
- [ ] Portfolio URL (optional, URL validation)
- [ ] Required experience level

#### Step 7: Primary Soviet
- [ ] 8 radio options with descriptions
- [ ] Descriptions visible
- [ ] Required

#### Step 8: Secondary Soviets
- [ ] 6 checkbox options (no "Multiple"/"Not sure")
- [ ] Max 3, counter "X/3"
- [ ] Optional

#### Step 9: Delegate Interest
- [ ] 5 radio options
- [ ] Helper text about delegate selection process
- [ ] Required
- [ ] Selecting "A" shows Step 10

#### Step 10: Delegate Motivations (Conditional)
- [ ] Only appears if Step 9 = "A"
- [ ] 9 checkbox options
- [ ] Required when shown
- [ ] Progress adjusts (14 vs 15 steps)

#### Step 11: Practical Proposal
- [ ] Textarea, 50-2500 chars
- [ ] Helper text with structure guide
- [ ] Char counter "X/2500" (yellow at 85%, red at 100%)
- [ ] Min 50 validation
- [ ] Required

#### Step 12: AI/Robotics Proposal
- [ ] Textarea, max 2500 chars
- [ ] Helper text
- [ ] Char counter
- [ ] Required

#### Step 13: First Month Actions
- [ ] 14 checkbox options
- [ ] Required (at least 1)

#### Step 14: Participation Modes
- [ ] 8 checkbox options
- [ ] Required (at least 1)

#### Step 15: Consent & Submit
- [ ] Privacy notice displayed
- [ ] Consent Contact (required)
- [ ] Confirm Accuracy (required)
- [ ] Public Profile Consent (optional, unchecked default)
- [ ] "Your email will never appear on your participant card"
- [ ] Submit button: "Submit & Generate My Participant Card"

### Navigation & State
- [ ] Back button works (preserves answers)
- [ ] Next button validates before advancing
- [ ] Progress bar updates
- [ ] Step counter "Step X of Y"
- [ ] Completion percentage updates
- [ ] Answers persist when navigating back/forward
- [ ] No data loss on accidental refresh (optional: localStorage backup)

### Submission
- [ ] Loading state: button disabled + "Submitting..."
- [ ] Success: redirects to `/result?pid=...&nickname=...&soviet=...`
- [ ] Error: friendly message, answers preserved
- [ ] Honeypot: bot submissions silently succeed (no sheet write)

### Result Page (`/result`)
- [ ] "Your participant card is ready."
- [ ] Thank you message
- [ ] Displays nickname, participant ID, preferred Soviet
- [ ] ParticipantCard renders correctly
- [ ] Download Card → saves PNG
- [ ] Share → Web Share API (mobile) / clipboard fallback (desktop)
- [ ] Edit / Correct Response → returns to `/quiz`
- [ ] Read the Full Proposal → external link

### ParticipantCard
- [ ] E-SOVIETS header
- [ ] Nickname in quotes
- [ ] Participant Number (ES-2026-XXXXXX)
- [ ] Preferred Soviet
- [ ] "ORGANIZE • DISCUSS • BUILD" motto
- [ ] No email anywhere
- [ ] Long nicknames wrap/truncate gracefully
- [ ] Long Soviet names fit
- [ ] Download → valid PNG (2x retina)
- [ ] Share works on mobile (Web Share API)
- [ ] Share fallback copies text + alerts

### Accessibility
- [ ] Tab through entire flow
- [ ] Focus visible on all interactive elements
- [ ] Screen reader announces errors
- [ ] Radio/checkbox groups use fieldset/legend
- [ ] Error messages connected via aria-describedby
- [ ] Skip to main content link works
- [ ] Contrast ratios pass WCAG AA

### Responsive
- [ ] 360px mobile: no horizontal scroll
- [ ] 768px tablet: 2-col Soviet grid
- [ ] 1024px desktop: 3-col Soviet grid
- [ ] Buttons min 44px touch targets
- [ ] Text readable without zoom (16px+)

---

## 4. Automated Tests

```bash
# TypeScript compilation
npm run build

# Linting
npm run lint

# Type checking only
npx tsc --noEmit
```

---

## 5. API Testing

### Valid Submission
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "TestUser",
    "email": "test@example.com",
    "proposalPosition": "B",
    "motivationInterests": ["Building practical projects"],
    "weeklyAvailability": "3–5 hours/week",
    "skills": ["Python", "Web development"],
    "experienceLevel": "Intermediate",
    "portfolioUrl": "",
    "preferredSoviet": "AI & Software Soviet",
    "secondarySoviets": [],
    "delegateInterest": "C",
    "delegateMotivations": [],
    "proposalText": "This is a test proposal that meets the minimum character requirement for the practical proposal field.",
    "aiRoboticsProposal": "AI should help reduce routine labor.",
    "firstMonthActions": ["Research"],
    "participationModes": ["Async online work"],
    "consentContact": true,
    "confirmAccuracy": true,
    "publicProfileConsent": false,
    "website": ""
  }'
```

Expected: `{"success":true,"participantId":"ES-2026-XXXXXX","nickname":"TestUser","preferredSoviet":"AI & Software Soviet"}`

### Invalid Submission (missing required)
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"nickname": "Test", "website": ""}'
```

Expected: 400 with field errors

### Honeypot Test
```bash
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"nickname": "Test", "email": "test@test.com", "website": "spam"}'
```

Expected: 200 success but no sheet write (silent drop)

### Rate Limit Test
```bash
for i in {1..15}; do
  curl -s -X POST http://localhost:3000/api/submit \
    -H "Content-Type: application/json" \
    -d '{"nickname": "Test", "email": "test@test.com", "website": ""}' \
    -w "\nHTTP %{http_code}\n"
done
```

Expected: First 10 succeed, then 429 "Too many requests"

### Oversized Payload
```bash
# Create 150KB payload
dd if=/dev/zero bs=150K count=1 | base64 > /tmp/large.txt
curl -X POST http://localhost:3000/api/submit \
  -H "Content-Type: application/json" \
  -d "{\"nickname\":\"Test\",\"email\":\"test@test.com\",\"data\":\"$(cat /tmp/large.txt)\",\"website\":\"\"}"
```

Expected: 413 "Payload too large"

---

## 6. Google Sheets Verification

1. Open your Google Sheet
2. Submit a test response via UI
3. Verify new row appears with all 23 columns:
   - timestamp (UTC ISO)
   - participant_id (ES-2026-XXXXXX)
   - nickname
   - email
   - proposal_position (A-F)
   - motivation_interests (pipe-delimited)
   - weekly_availability
   - skills (pipe-delimited)
   - experience_level
   - portfolio_url
   - preferred_soviet
   - secondary_soviets (pipe-delimited)
   - delegate_interest (A-E)
   - delegate_motivations (pipe-delimited)
   - proposal_text
   - ai_robotics_proposal
   - first_month_actions (pipe-delimited)
   - participation_modes (pipe-delimited)
   - consent_contact (true/false)
   - confirm_accuracy (true/false)
   - public_profile_consent (true/false)
   - user_agent

4. Submit again with same email → new row + duplicate warning on result page

---

## 7. Security Verification

```bash
# Check no credentials in client bundle
npm run build
# Open http://localhost:3000, open DevTools → Network → main.js
# Search for "GOOGLE_" or "PRIVATE_KEY" - should NOT appear

# Check API response doesn't leak credentials
curl -X POST http://localhost:3000/api/submit ...
# Verify response only has: success, participantId, nickname, preferredSoviet
```

---

## 8. XSS Testing

In any text field (proposal, AI proposal, nickname), test:
```html
<script>alert(1)</script>
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
```

Expected: Rendered as plain text, not executed. Check participant card download.

---

## 9. Duplicate Email Test

1. Submit with email `test@example.com`
2. Submit again with same email
3. Result page shows yellow banner: "We already have a response from this email..."
3. Google Sheet has 2 rows with same email, different participant IDs

---

## 10. Production Build Test

```bash
npm run build
npm run start
# Test at http://localhost:3000 (production mode)
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Missing Google Sheets environment variables" | Check `.env.local` exists and has all 4 vars |
| "We couldn't save your response" | Check Vercel/terminal logs; verify service account has Editor access on sheet |
| Private key format error | Ensure key has actual newlines, not `\n` literal |
| Sheet not found | Verify `GOOGLE_SHEET_ID` from URL; `GOOGLE_SHEET_NAME` matches tab exactly |
| TypeScript errors | Run `npm run build` locally first |
| Rate limit not working | In-memory Map resets on server restart; normal for dev |

---

## Next Steps

After all tests pass:
1. Push to GitHub
2. Import in Vercel
3. Add 4 environment variables in Vercel dashboard
4. Deploy
5. Run same tests against production URL