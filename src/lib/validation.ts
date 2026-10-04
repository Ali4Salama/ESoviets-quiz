import { z } from 'zod';

const nicknameSchema = z
  .string()
  .min(2, 'Nickname must be at least 2 characters')
  .max(30, 'Nickname must be at most 30 characters')
  .regex(/^[a-zA-Z0-9\s_-]+$/, 'Nickname can only contain letters, numbers, spaces, underscores, and hyphens')
  .transform((val) => val.trim());

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format');

const proposalPositionSchema = z.enum(['A', 'B', 'C', 'D', 'E', 'F']);

const motivationInterestsSchema = z
  .array(z.string())
  .min(1, 'Select at least one interest')
  .max(5, 'Maximum 5 interests allowed');

const weeklyAvailabilitySchema = z.enum([
  'Less than 1 hour/week',
  '1–2 hours/week',
  '3–5 hours/week',
  '6–10 hours/week',
  '11–20 hours/week',
  '20+ hours/week',
  'My availability changes from week to week',
  'I cannot volunteer right now',
]);

const skillsSchema = z
  .array(z.string())
  .min(1, 'Select at least one skill')
  .max(15, 'Maximum 15 skills allowed');

const experienceLevelSchema = z.enum([
  'Beginner',
  'Some experience',
  'Intermediate',
  'Advanced',
  'Professional / expert',
  'I have knowledge but no practical experience yet',
]);

const portfolioUrlSchema = z
  .string()
  .url('Invalid URL format')
  .optional()
  .or(z.literal(''));

const preferredSovietSchema = z.enum([
  'Agitprop & Counter-Propaganda Soviet',
  'AI & Software Soviet',
  'Marxist Theory Soviet',
  'Geo-Engineering & Climate Soviet',
  'Human Health & Wellbeing Soviet',
  'Cybernetic Economy Soviet',
  'I would like to work across multiple Soviets',
  'I am not sure yet',
]);

const secondarySovietsSchema = z
  .array(z.string())
  .max(3, 'Maximum 3 secondary Soviets allowed');

const delegateInterestSchema = z.enum(['A', 'B', 'C', 'D', 'E']);

const delegateMotivationsSchema = z.array(z.string()).optional();

const proposalTextSchema = z
  .string()
  .min(50, 'Proposal must be at least 50 characters')
  .max(2500, 'Proposal must be at most 2,500 characters');

const aiRoboticsProposalSchema = z
  .string()
  .max(2500, 'Proposal must be at most 2,500 characters');

const firstMonthActionsSchema = z
  .array(z.string())
  .min(1, 'Select at least one action');

const participationModesSchema = z
  .array(z.string())
  .min(1, 'Select at least one participation mode');

const consentContactSchema = z.literal(true);

const confirmAccuracySchema = z.literal(true);

const publicProfileConsentSchema = z.boolean().optional();

export const quizStepSchemas = {
  1: z.object({
    nickname: nicknameSchema,
    email: emailSchema,
  }),
  2: z.object({
    proposalPosition: proposalPositionSchema,
  }),
  3: z.object({
    motivationInterests: motivationInterestsSchema,
  }),
  4: z.object({
    weeklyAvailability: weeklyAvailabilitySchema,
  }),
  5: z.object({
    skills: skillsSchema,
  }),
  6: z.object({
    experienceLevel: experienceLevelSchema,
    portfolioUrl: portfolioUrlSchema,
  }),
  7: z.object({
    preferredSoviet: preferredSovietSchema,
  }),
  8: z.object({
    secondarySoviets: secondarySovietsSchema,
  }),
  9: z.object({
    delegateInterest: delegateInterestSchema,
  }),
  10: z.object({
    delegateMotivations: delegateMotivationsSchema,
  }),
  11: z.object({
    proposalText: proposalTextSchema,
  }),
  12: z.object({
    aiRoboticsProposal: aiRoboticsProposalSchema,
  }),
  13: z.object({
    firstMonthActions: firstMonthActionsSchema,
  }),
  14: z.object({
    participationModes: participationModesSchema,
  }),
  15: z.object({
    consentContact: consentContactSchema,
    confirmAccuracy: confirmAccuracySchema,
    publicProfileConsent: publicProfileConsentSchema,
  }),
};

export const fullQuizSchema = z.object({
  nickname: nicknameSchema,
  email: emailSchema,
  proposalPosition: proposalPositionSchema,
  motivationInterests: motivationInterestsSchema,
  weeklyAvailability: weeklyAvailabilitySchema,
  skills: skillsSchema,
  experienceLevel: experienceLevelSchema,
  portfolioUrl: portfolioUrlSchema,
  preferredSoviet: preferredSovietSchema,
  secondarySoviets: secondarySovietsSchema,
  delegateInterest: delegateInterestSchema,
  delegateMotivations: delegateMotivationsSchema,
  proposalText: proposalTextSchema,
  aiRoboticsProposal: aiRoboticsProposalSchema,
  firstMonthActions: firstMonthActionsSchema,
  participationModes: participationModesSchema,
  consentContact: consentContactSchema,
  confirmAccuracy: confirmAccuracySchema,
  publicProfileConsent: publicProfileConsentSchema,
});

export type QuizStepData = {
  [K in keyof typeof quizStepSchemas]: z.infer<typeof quizStepSchemas[K]>;
};

export function validateStep(step: number, data: unknown) {
  const schema = quizStepSchemas[step as keyof typeof quizStepSchemas];
  if (!schema) {
    return { success: true, data, errors: null };
  }
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  return { success: false, data: null, errors };
}

export function validateFullQuiz(data: unknown) {
  const result = fullQuizSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join('.');
    errors[path] = issue.message;
  }
  return { success: false, data: null, errors };
}