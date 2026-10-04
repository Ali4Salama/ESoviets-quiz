const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function generateParticipantId(): string {
  const year = new Date().getFullYear();
  const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(6)))
    .map((b) => CHARS[b % CHARS.length])
    .join('');
  return `ES-${year}-${randomPart}`;
}

export function generateSubmissionId(): string {
  return crypto.randomUUID();
}