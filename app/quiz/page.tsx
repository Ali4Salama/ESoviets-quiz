'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuestionCard } from '@/components/QuestionCard';
import { SingleSelect } from '@/components/SingleSelect';
import { MultiSelect } from '@/components/MultiSelect';
import { TextQuestion } from '@/components/TextQuestion';
import { validateStep, validateFullQuiz } from '@/lib/validation';
import type { QuizResponse } from '@/lib/quizSchema';

const TOTAL_STEPS = 15;
const REQUIRED_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15];

// Steps that are conditional (hidden when delegate not interested)
const CONDITIONAL_STEPS = [10];

// Get the actual step number for a given UI step
const getEffectiveStep = (uiStep: number, delegateInterested: boolean): number => {
  if (!delegateInterested && uiStep >= 10) {
    return uiStep + 1; // Skip step 10, so UI step 10 = actual step 11
  }
  return uiStep;
};

// Get the UI step for a given actual step
const getUIStep = (effectiveStep: number, delegateInterested: boolean): number => {
  if (!delegateInterested && effectiveStep > 10) {
    return effectiveStep - 1; // Skip step 10 in UI
  }
  return effectiveStep;
};

// Get total UI steps based on delegate interest
const getTotalUISteps = (delegateInterested: boolean): number => {
  return delegateInterested ? TOTAL_STEPS : TOTAL_STEPS - 1;
};

const stepConfig = {
  1: {
    title: 'Basic Identity',
    description: 'Let us know how to address you and how to reach you.',
    fields: ['nickname', 'email'],
  },
  2: {
    title: 'Your Position',
    description: 'How do you feel about the E-Soviets proposal?',
    fields: ['proposalPosition'],
  },
  3: {
    title: 'Motivation',
    description: 'What interests you most about this work?',
    fields: ['motivationInterests'],
  },
  4: {
    title: 'Availability',
    description: 'How much time can you realistically volunteer each week?',
    fields: ['weeklyAvailability'],
  },
  5: {
    title: 'Skills',
    description: 'Which skills can you contribute? (Max 15)',
    fields: ['skills'],
  },
  6: {
    title: 'Experience',
    description: 'How would you describe your experience level?',
    fields: ['experienceLevel', 'portfolioUrl'],
  },
  7: {
    title: 'Primary Soviet',
    description: 'Which Soviet would you most like to work with?',
    fields: ['preferredSoviet'],
  },
  8: {
    title: 'Secondary Soviets',
    description: 'Which other areas could you contribute to? (Max 3)',
    fields: ['secondarySoviets'],
  },
  9: {
    title: 'Delegate Interest',
    description: 'Would you like to be considered as a delegate?',
    fields: ['delegateInterest'],
  },
  10: {
    title: 'Delegate Motivations',
    description: 'Why would you like to become a delegate?',
    fields: ['delegateMotivations'],
  },
  11: {
    title: 'Practical Proposal',
    description: 'If you could propose ONE concrete project for the first year, what would it be?',
    fields: ['proposalText'],
  },
  12: {
    title: 'AI & Robotics Proposal',
    description: 'How to prepare and organize a GLOBAL revolution by using technology?',
    fields: ['aiRoboticsProposal'],
  },
  13: {
    title: 'First Month Actions',
    description: 'What could you personally do during your first month?',
    fields: ['firstMonthActions'],
  },
  14: {
    title: 'Participation Modes',
    description: 'How would you prefer to participate?',
    fields: ['participationModes'],
  },
  15: {
    title: 'Consent & Submit',
    description: 'Final agreements before submitting.',
    fields: ['consentContact', 'confirmAccuracy'],
  },
};

const proposalPositionOptions = [
  { value: 'A', label: 'I strongly support the proposal and want to help build it.' },
  { value: 'B', label: 'I generally support the idea and would like to participate.' },
  { value: 'C', label: 'I support some parts but have important questions or disagreements.' },
  { value: 'D', label: 'I am uncertain and want to learn more before deciding.' },
  { value: 'E', label: 'I do not currently support the proposal, but I am interested in discussing it.' },
  { value: 'F', label: 'I do not support the proposal and do not want to participate.' },
];

const motivationInterestsOptions = [
  'Building practical projects',
  'AI and software',
  'Scientific research',
  'Philosophy and political theory',
  'Climate and energy',
  'Human health and wellbeing',
  'Economic planning and resource allocation',
  'Media and communication',
  'Education and training',
  'Community organization',
  'Research/data analysis',
  'Other',
];

const weeklyAvailabilityOptions = [
  'Less than 1 hour/week',
  '1–2 hours/week',
  '3–5 hours/week',
  '6–10 hours/week',
  '11–20 hours/week',
  '20+ hours/week',
  'My availability changes from week to week',
  'I cannot volunteer right now',
];

const skillCategories = [
  {
    category: 'Computer Science ',
    options: [
      { value: 'Vibe coding', label: 'Vibe coding' },
      { value: 'Web development', label: 'Web development' },
      { value: 'Mobile development', label: 'Mobile development' },
      { value: 'AI / LLMs', label: 'AI / LLMs' },
      { value: 'Data science', label: 'Data science' },
      { value: 'RAG / knowledge graphs', label: 'RAG / knowledge graphs' },
      { value: 'Cybersecurity', label: 'Cybersecurity' },
      { value: 'DevOps / cloud', label: 'DevOps / cloud' },
      { value: 'Databases', label: 'Databases' },
    ],
  },
  {
    category: 'Science & Engineering',
    options: [
      { value: 'Mathematics', label: 'Mathematics' },
      { value: 'Physics', label: 'Physics' },
      { value: 'Chemistry', label: 'Chemistry' },
      { value: 'Biology', label: 'Biology' },
      { value: 'Medicine / health sciences', label: 'Medicine / health sciences' },
      { value: 'Geology', label: 'Geology' },
      { value: 'Climate science', label: 'Climate science' },
      { value: 'Engineering', label: 'Engineering' },
      { value: 'Energy systems', label: 'Energy systems' },
      { value: 'Robotics', label: 'Robotics' },

    ],
  },
  {
    category: 'Theory & Research',
    options: [
      { value: 'Marxist theory', label: 'Marxist theory' },
      { value: 'Philosophy', label: 'Philosophy' },
      { value: 'Economics', label: 'Economics' },
      { value: 'Sociology', label: 'Sociology' },
      { value: 'History', label: 'History' },
      { value: 'Research / literature review', label: 'Research / literature review' },
      { value: 'psychoanalysis', label: 'psychoanalysis' },
    ],
  },
  {
    category: 'Media & Communication',
    options: [
      { value: 'Writing', label: 'Writing' },
      { value: 'Graphic design', label: 'Graphic design' },
      { value: 'Video editing', label: 'Video editing' },
      { value: 'Animation', label: 'Animation' },
      { value: 'Translation', label: 'Translation' },
      { value: 'Public speaking', label: 'Public speaking' },
    ],
  },
  {
    category: 'Organization',
    options: [
      { value: 'Project management', label: 'Project management' },
      { value: 'Community management', label: 'Community management' },
      { value: 'Event organization', label: 'Event organization' },
      { value: 'Teaching', label: 'Teaching' },
      { value: 'Fundraising', label: 'Fundraising' },
      { value: 'Operations', label: 'Operations' },
      { value: 'Other', label: 'Other' },
    ],
  },
];

const experienceLevelOptions = [
  'Beginner',
  'Some experience',
  'Intermediate',
  'Advanced',
  'Professional / expert',
  'I have knowledge but no practical experience yet',
];

const preferredSovietOptions = [
  { value: 'Agitprop & Counter-Propaganda Soviet', label: 'Agitprop & Counter-Propaganda Soviet', description: 'Media research, Content adaptation, Educational content, Audience research, Media production, Communication strategy' },
  { value: 'AI & Software Soviet', label: 'AI & Software Soviet', description: 'AI tools, Software development, Cybersecurity, Data analysis, AI-assisted development, Video/media automation' },
  { value: 'Marxist Theory Soviet', label: 'Marxist Theory Soviet', description: 'Philosophy, Political economy, Historical analysis, Technology ethics, Contemporary theory, Education' },
  { value: 'Geo-Engineering & Climate Soviet', label: 'Geo-Engineering & Climate Soviet', description: 'Climate research, Energy, Carbon capture, Waste and pollution, Ocean cleanup, Geological risk research' },
  { value: 'Human Health & Wellbeing Soviet', label: 'Human Health & Wellbeing Soviet', description: 'Health research, Food systems, Biotechnology, Public health, Health technology, Scientific research' },
  { value: 'Cybernetic Economy Soviet', label: 'Cybernetic Economy Soviet', description: 'Resource planning, Supply chains, Economic modeling, Optimization, Data networks, Economic cybernetics' },
  { value: 'I would like to work across multiple Soviets', label: 'I would like to work across multiple Soviets', description: '' },
  { value: 'I am not sure yet', label: 'I am not sure yet', description: '' },
];

const secondarySovietOptions = [
  'Agitprop & Counter-Propaganda Soviet',
  'AI & Software Soviet',
  'Marxist Theory Soviet',
  'Geo-Engineering & Climate Soviet',
  'Human Health & Wellbeing Soviet',
  'Cybernetic Economy Soviet',
];

const delegateInterestOptions = [
  { value: 'A', label: 'Yes, I would like to be considered.' },
  { value: 'B', label: 'Maybe — I want to understand the responsibilities first.' },
  { value: 'C', label: 'I prefer to contribute as a volunteer without a representative role.' },
  { value: 'D', label: 'I would rather work on projects independently.' },
  { value: 'E', label: 'I am not interested in a delegate role.' },
];

const delegateMotivationsOptions = [
  'Represent the interests of participants in my Soviet',
  'Help coordinate projects',
  'Help organize meetings',
  'Present proposals',
  'Coordinate research',
  'Help recruit and train contributors',
  'Connect different Soviets',
  'Help establish rules and procedures',
  'Other',
];

const firstMonthActionsOptions = [
  'Build software',
  'Research',
  'Write',
  'Translate',
  'Design',
  'Produce videos',
  'Analyze data',
  'Organize people',
  'Teach',
  'Test software',
  'Conduct interviews',
  'Develop a project proposal',
  'Help with website/social media',
  'Other',
];

const participationModesOptions = [
  'Async online work',
  'Weekly online meetings',
  'Occasional meetings',
  'Research groups',
  'Software/project teams',
  'Local activities',
  'International collaboration',
  'Educational/cadre programs',
];

const proposalTextHelper = `Good proposal structure:
1. Problem
2. Proposed solution
3. Who would work on it
4. First milestone
5. Expected result`;

const aiRoboticsHelper = `Give your own proposal for how AI and robotics could be used to reduce routine labor and expand human freedom, scientific research, education, creativity, or access to resources.`;

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Partial<QuizResponse>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();

  const isDelegateInterested = answers.delegateInterest === 'A';
  const totalSteps = getTotalUISteps(isDelegateInterested);
  const effectiveStep = getEffectiveStep(currentStep, isDelegateInterested);

  // Focus management on step change
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, [currentStep]);

  const completedSteps = useCallback(() => {
    let count = 0;
    for (const step of REQUIRED_STEPS) {
      const uiStep = getUIStep(step, isDelegateInterested);
      if (uiStep <= currentStep) {
        const stepFields = stepConfig[step as keyof typeof stepConfig]?.fields || [];
        const hasAllFields = stepFields.every(field => {
          const value = answers[field as keyof QuizResponse];
          if (Array.isArray(value)) return value.length > 0;
          return value !== undefined && value !== '';
        });
        if (hasAllFields) count++;
      }
    }
    return count;
  }, [answers, currentStep, isDelegateInterested]);

  const validateCurrentStep = useCallback(() => {
    const config = stepConfig[effectiveStep as keyof typeof stepConfig];
    if (!config) return true;

    const stepData = config.fields.reduce((acc, field) => {
      acc[field] = answers[field as keyof QuizResponse];
      return acc;
    }, {} as Record<string, unknown>);

    const result = validateStep(effectiveStep, stepData);
    if (result.success) {
      setErrors(prev => {
        const next = { ...prev };
        config.fields.forEach(f => delete next[f]);
        return next;
      });
      return true;
    } else {
      setErrors(prev => ({ ...prev, ...result.errors }));
      return false;
    }
  }, [answers, effectiveStep]);

  const handleSubmit = useCallback(async () => {
    const fullValidation = validateFullQuiz(answers);
    if (!fullValidation.success) {
      const fieldErrors = fullValidation.errors || {};
      setErrors(fieldErrors);
      
      // Find first error field and navigate to its step
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const stepForField = Object.entries(stepConfig).find(([, config]) => 
          config.fields.includes(firstErrorField)
        )?.[0];
        if (stepForField) {
          const stepNum = parseInt(stepForField, 10);
          if (stepNum !== currentStep) {
            setCurrentStep(stepNum);
            setTimeout(() => window.scrollTo(0, 0), 50);
          }
        }
      }
      
      const errorFields = Object.keys(fieldErrors).join(', ');
      setSubmitError(`Please fix the highlighted errors above before submitting. Issues found: ${errorFields}`);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, website: '' }),
      });

      const data = await response.json();

      if (data.success) {
        const params = new URLSearchParams({
          pid: data.participantId,
          nickname: data.nickname,
          soviet: data.preferredSoviet,
        });
        if (data.duplicateWarning) {
          params.set('duplicate', '1');
        }
        router.push(`/result?${params.toString()}`);
      } else {
        setSubmitError(data.error || 'Submission failed. Please try again.');
        if (data.errors) setErrors(data.errors);
      }
    } catch {
      setSubmitError('We couldn\'t save your response right now. Please try again in a moment.');
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, router]);

  const goBack = useCallback(() => {
    let prevStep = currentStep - 1;
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
      window.scrollTo(0, 0);
    }
  }, [currentStep]);

  const goNext = useCallback(() => {
    if (validateCurrentStep()) {
      if (currentStep === totalSteps) {
        handleSubmit();
      } else {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  }, [currentStep, totalSteps, validateCurrentStep, handleSubmit]);

  const updateAnswer = useCallback(<T,>(field: string, value: T) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  }, [errors]);

  const renderStep = () => {
    const config = stepConfig[effectiveStep as keyof typeof stepConfig];
    if (!config) return null;

    switch (effectiveStep) {
      case 1:
        return (
          <div className="space-y-4">
            <TextQuestion
              name="nickname"
              label="What nickname would you like us to use?"
              placeholder="e.g., Nova"
              value={answers.nickname || ''}
              onChange={v => updateAnswer('nickname', v)}
              minLength={2}
              maxLength={30}
              error={errors.nickname}
              required
            />
            <TextQuestion
              name="email"
              label="What email can we use to contact you?"
              placeholder="you@example.com"
              value={answers.email || ''}
              onChange={v => updateAnswer('email', v)}
              error={errors.email}
              required
              helperText="Your email will be used only for project communication and participation follow-up."
            />
          </div>
        );

      case 2:
        return (
          <SingleSelect
            name="proposalPosition"
            label="After reading the proposal, which statement best describes your position?"
            options={proposalPositionOptions}
            value={answers.proposalPosition || ''}
            onChange={v => updateAnswer('proposalPosition', v)}
            error={errors.proposalPosition}
            required
          />
        );

      case 3:
        return (
          <MultiSelect
            name="motivationInterests"
            label="What interests you most?"
            options={motivationInterestsOptions.map(o => ({ value: o, label: o }))}
            value={answers.motivationInterests || []}
            onChange={v => updateAnswer('motivationInterests', v)}
            maxSelections={5}
            error={errors.motivationInterests}
            required
          />
        );

      case 4:
        return (
          <SingleSelect
            name="weeklyAvailability"
            label="How much time can you realistically volunteer?"
            options={weeklyAvailabilityOptions.map(o => ({ value: o, label: o }))}
            value={answers.weeklyAvailability || ''}
            onChange={v => updateAnswer('weeklyAvailability', v)}
            error={errors.weeklyAvailability}
            required
          />
        );

      case 5:
        return (
          <MultiSelect
            name="skills"
            label="Which skills can you contribute?"
            value={answers.skills || []}
            onChange={v => updateAnswer('skills', v)}
            maxSelections={15}
            error={errors.skills}
            required
            categorized
            categories={skillCategories}
          />
        );

      case 6:
        return (
          <div className="space-y-6">
            <SingleSelect
              name="experienceLevel"
              label="How would you describe your experience?"
              options={experienceLevelOptions.map(o => ({ value: o, label: o }))}
              value={answers.experienceLevel || ''}
              onChange={v => updateAnswer('experienceLevel', v)}
              error={errors.experienceLevel}
              required
            />
            <TextQuestion
              name="portfolioUrl"
              label="Portfolio / profile (optional)"
              placeholder="GitHub, LinkedIn, personal website, publications, research profile"
              value={answers.portfolioUrl || ''}
              onChange={v => updateAnswer('portfolioUrl', v)}
              error={errors.portfolioUrl}
              required={false}
              helperText="GitHub, LinkedIn, personal website, publications, research profile"
            />
          </div>
        );

      case 7:
        return (
          <SingleSelect
            name="preferredSoviet"
            label="Which Soviet would you most like to work with?"
            options={preferredSovietOptions}
            value={answers.preferredSoviet || ''}
            onChange={v => updateAnswer('preferredSoviet', v)}
            error={errors.preferredSoviet}
            required
          />
        );

      case 8:
        return (
          <MultiSelect
            name="secondarySoviets"
            label="Which other areas could you contribute to?"
            options={secondarySovietOptions.map(o => ({ value: o, label: o }))}
            value={answers.secondarySoviets || []}
            onChange={v => updateAnswer('secondarySoviets', v)}
            maxSelections={3}
            error={errors.secondarySoviets}
            required={false}
          />
        );

      case 9:
        return (
          <div className="space-y-4">
            <SingleSelect
              name="delegateInterest"
              label="Would you like to be considered as a delegate/member representative for one of the Soviets?"
              options={delegateInterestOptions}
              value={answers.delegateInterest || ''}
              onChange={v => updateAnswer('delegateInterest', v)}
              error={errors.delegateInterest}
              required
            />
            <p className="text-sm text-gray-400 mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-800">
              <strong>Note:</strong> Delegate selection, if introduced, should be handled through the project&apos;s
              defined organizational process. This quiz only records your interest.
            </p>
          </div>
        );

      case 10:
        return (
          <MultiSelect
            name="delegateMotivations"
            label="Why would you like to become a delegate?"
            options={delegateMotivationsOptions.map(o => ({ value: o, label: o }))}
            value={answers.delegateMotivations || []}
            onChange={v => updateAnswer('delegateMotivations', v)}
            error={errors.delegateMotivations}
            required
          />
        );

      case 11:
        return (
          <TextQuestion
            name="proposalText"
            label="If you could propose ONE concrete project for E-Soviets to work on during its first year, what would it be?"
            placeholder="Describe a practical project that could be started by a small team..."
            value={answers.proposalText || ''}
            onChange={v => updateAnswer('proposalText', v)}
            minLength={50}
            maxLength={2500}
            error={errors.proposalText}
            required
            helperText={proposalTextHelper}
          />
        );

      case 12:
        return (
          <TextQuestion
            name="aiRoboticsProposal"
            label="How should AI and robotics change society?"
            placeholder="Give your own proposal for how AI and robotics could be used to reduce routine labor..."
            value={answers.aiRoboticsProposal || ''}
            onChange={v => updateAnswer('aiRoboticsProposal', v)}
            maxLength={2500}
            error={errors.aiRoboticsProposal}
            required
            helperText={aiRoboticsHelper}
          />
        );

      case 13:
        return (
          <MultiSelect
            name="firstMonthActions"
            label="What could you personally do during your first month?"
            options={firstMonthActionsOptions.map(o => ({ value: o, label: o }))}
            value={answers.firstMonthActions || []}
            onChange={v => updateAnswer('firstMonthActions', v)}
            error={errors.firstMonthActions}
            required
          />
        );

      case 14:
        return (
          <MultiSelect
            name="participationModes"
            label="How would you prefer to participate?"
            options={participationModesOptions.map(o => ({ value: o, label: o }))}
            value={answers.participationModes || []}
            onChange={v => updateAnswer('participationModes', v)}
            error={errors.participationModes}
            required
          />
        );

      case 15:
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl mb-4">
                <p className="text-sm text-gray-300">
                  <strong>Privacy Notice:</strong> Your responses contain personal information. We collect them to
                  understand participation, organize volunteers, and contact you about E-Soviets. Your email will
                  not appear on your participant card.
                </p>
              </div>

              <label className="relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer touch-manipulation min-h-[56px] border-gray-700 bg-gray-900/30 hover:border-gray-500 hover:bg-gray-900/50 focus-within:border-red-500 focus-within:bg-red-500/10 focus-within:ring-2 focus-within:ring-red-500/20">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={answers.consentContact === true}
                    onChange={e => updateAnswer('consentContact', e.target.checked)}
                    className="sr-only peer"
                    required
                  />
                  <div className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:shadow-[0_0_0_2px_rgba(204,0,0,0.3)] peer-hover:border-gray-400 border-gray-500 bg-gray-800">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 peer-focus:ring-offset-2 peer-focus:ring-offset-black rounded-xl py-1">
                  <span className="font-medium text-white text-sm leading-relaxed">
                    I agree that E-Soviets may store my submitted contact information and questionnaire responses
                    for the purpose of organizing and contacting participants.
                  </span>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 opacity-0 peer-hover:opacity-100 peer-focus:opacity-100 peer-checked:opacity-100 transition-opacity duration-200" aria-hidden="true">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </label>

              <label className="relative flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer touch-manipulation min-h-[56px] border-gray-700 bg-gray-900/30 hover:border-gray-500 hover:bg-gray-900/50 focus-within:border-red-500 focus-within:bg-red-500/10 focus-within:ring-2 focus-within:ring-red-500/20">
                <div className="flex items-center gap-3 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={answers.confirmAccuracy === true}
                    onChange={e => updateAnswer('confirmAccuracy', e.target.checked)}
                    className="sr-only peer"
                    required
                  />
                  <div className="w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 peer-checked:border-red-500 peer-checked:bg-red-500 peer-checked:shadow-[0_0_0_2px_rgba(204,0,0,0.3)] peer-hover:border-gray-400 border-gray-500 bg-gray-800">
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 peer-focus:ring-offset-2 peer-focus:ring-offset-black rounded-xl py-1">
                  <span className="font-medium text-white text-sm leading-relaxed">
                    I confirm that the information I submitted is accurate to the best of my knowledge.
                  </span>
                </div>
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 opacity-0 peer-hover:opacity-100 peer-focus:opacity-100 peer-checked:opacity-100 transition-opacity duration-200" aria-hidden="true">
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </label>

              </div>
          </div>
        );

      default:
        return null;
    }
  };

  const config = stepConfig[effectiveStep as keyof typeof stepConfig];
  const stepError = submitError;

  return (
    <QuestionCard
      step={effectiveStep}
      totalSteps={totalSteps}
      title={config?.title || ''}
      description={config?.description || ''}
      error={stepError}
      onBack={goBack}
      onNext={goNext}
      canGoBack={currentStep > 1}
      isSubmitting={isSubmitting}
      isLastStep={currentStep === totalSteps}
      completedSteps={completedSteps()}
    >
      {renderStep()}
    </QuestionCard>
  );
}