import { NextRequest, NextResponse } from 'next/server';
import { validateFullQuiz } from '@/lib/validation';
import { appendToSheet } from '@/lib/googleSheets';
import { generateParticipantId, generateSubmissionId } from '@/lib/participantId';

const HONEYPOT_FIELD = 'website';
const MAX_PAYLOAD_SIZE = 100 * 1024;

// Rate limiting: 10 requests per minute per IP
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Duplicate email tracking (in-memory, resets on function restart)
const submittedEmails = new Set<string>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0];
    return firstIp ? firstIp.trim() : 'unknown';
  }
  const realIp = request.headers.get('x-real-ip');
  return realIp || 'unknown';
}

function formatRowForSheets(data: unknown, participantId: string, userAgent: string): string[] {
  const d = data as Record<string, unknown>;
  const joinOrEmpty = (arr: unknown[]) => (Array.isArray(arr) ? arr.join(' | ') : '');
  const boolToStr = (v: unknown) => (v === true ? 'true' : 'false');

  return [
    new Date().toISOString(),
    participantId,
    String(d.nickname || ''),
    String(d.email || ''),
    String(d.country || ''),
    String(d.proposalPosition || ''),
    joinOrEmpty(d.motivationInterests as string[]),
    String(d.weeklyAvailability || ''),
    joinOrEmpty(d.skills as string[]),
    String(d.experienceLevel || ''),
    String(d.portfolioUrl || ''),
    String(d.socialX || ''),
    String(d.socialInstagram || ''),
    String(d.socialTelegram || ''),
    String(d.socialTiktok || ''),
    String(d.socialLink || ''),
    String(d.preferredSoviet || ''),
    joinOrEmpty(d.secondarySoviets as string[]),
    String(d.delegateInterest || ''),
    joinOrEmpty(d.delegateMotivations as string[]),
    String(d.proposalText || ''),
    String(d.aiRoboticsProposal || ''),
    joinOrEmpty(d.firstMonthActions as string[]),
    joinOrEmpty(d.participationModes as string[]),
    boolToStr(d.consentContact),
    boolToStr(d.confirmAccuracy),
    boolToStr(d.publicProfileConsent),
    userAgent,
  ];
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429 }
      );
    }

    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json({ success: false, error: 'Payload too large' }, { status: 413 });
    }

    const body = await request.json();

    if (body[HONEYPOT_FIELD] && String(body[HONEYPOT_FIELD]).trim() !== '') {
      return NextResponse.json({ success: true, participantId: generateParticipantId() });
    }

    const validation = validateFullQuiz(body);
    if (!validation.success || !validation.data) {
      return NextResponse.json({ success: false, errors: validation.errors }, { status: 400 });
    }

    const { data } = validation;

    // Check for duplicate email
    const email = data.email.toLowerCase();
    const isDuplicateEmail = submittedEmails.has(email);
    submittedEmails.add(email);

    const participantId = generateParticipantId();
    generateSubmissionId(); // for duplicate tracking

    const userAgent = request.headers.get('user-agent') || '';

    const row = formatRowForSheets(data, participantId, userAgent);

    await appendToSheet(row);

    const response: Record<string, unknown> = {
      success: true,
      participantId,
      nickname: data.nickname,
      preferredSoviet: data.preferredSoviet,
    };

    if (isDuplicateEmail) {
      response.duplicateWarning = 'We already have a response from this email. You can still submit an updated response.';
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Submit error:', error);
    return NextResponse.json(
      { success: false, error: 'We couldn\'t save your response right now. Please try again in a moment.' },
      { status: 500 }
    );
  }
}