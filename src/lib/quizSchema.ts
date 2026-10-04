export interface QuizResponse {
  nickname: string;
  email: string;
  proposalPosition: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  motivationInterests: string[];
  weeklyAvailability: string;
  skills: string[];
  experienceLevel: string;
  portfolioUrl?: string;
  preferredSoviet: string;
  secondarySoviets: string[];
  delegateInterest: 'A' | 'B' | 'C' | 'D' | 'E';
  delegateMotivations?: string[];
  proposalText: string;
  aiRoboticsProposal: string;
  firstMonthActions: string[];
  participationModes: string[];
  consentContact: boolean;
  confirmAccuracy: boolean;
  publicProfileConsent?: boolean;
}

export interface ApiSubmitResponse {
  success: boolean;
  participantId?: string;
  nickname?: string;
  preferredSoviet?: string;
  error?: string;
  duplicateWarning?: string;
}

export interface ParticipantCardData {
  nickname: string;
  participantId: string;
  preferredSoviet: string;
  status?: string;
}