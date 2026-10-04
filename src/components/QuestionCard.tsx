'use client';

import { QuizProgress } from './QuizProgress';

interface QuestionCardProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: React.ReactNode;
  error?: string;
  onBack: () => void;
  onNext: () => void;
  canGoBack: boolean;
  isSubmitting?: boolean;
  isLastStep?: boolean;
  completedSteps?: number;
}

export function QuestionCard({
  step,
  totalSteps,
  title,
  description,
  children,
  error,
  onBack,
  onNext,
  canGoBack,
  isSubmitting,
  isLastStep,
  completedSteps = step - 1,
}: QuestionCardProps) {
  return (
    <main className="relative min-h-screen bg-[#05070d] flex flex-col overflow-hidden" id="main-content">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="quiz-grid-bg absolute inset-0" />
        <div className="quiz-orb-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-red-600/20 blur-[130px]" />
        <div className="quiz-orb-b absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[220px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <QuizProgress
          currentStep={step}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
        />

        <div className="flex-1 flex items-center justify-center px-4 py-8 w-full max-w-2xl mx-auto">
          <div className="w-full rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] p-6 sm:p-10 space-y-7">
            <header className="text-center space-y-3">
              <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" aria-hidden="true" />
                E-Soviets // Onboarding
              </p>
              <h1 className="text-2xl md:text-[2rem] leading-tight font-bold text-white bg-gradient-to-b from-white to-white/70 bg-clip-text">
                {title}
              </h1>
              {description && (
                <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">{description}</p>
              )}
            </header>

            {error && (
              <div
                role="alert"
                className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-200 text-sm shadow-[0_0_28px_rgba(220,38,38,0.25)]"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <div className="space-y-5">{children}</div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              {canGoBack && (
                <button
                  type="button"
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-4 text-base font-medium text-gray-200 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-white/25 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[44px] touch-manipulation disabled:opacity-50"
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={onNext}
                disabled={isSubmitting}
                className="group relative w-full sm:w-auto px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-red-700 via-red-600 to-orange-600 shadow-[0_8px_36px_rgba(220,38,38,0.45)] hover:shadow-[0_8px_48px_rgba(220,38,38,0.6)] hover:brightness-110"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Transmitting…' : isLastStep ? 'Submit & Generate My Participant Card' : 'Continue →'}
                </span>
                <span className="progress-shimmer absolute inset-0" aria-hidden="true" />
              </button>
            </div>

            <p className="text-center text-[11px] font-mono uppercase tracking-[0.2em] text-gray-600">
              Secured channel · Step {step}/{totalSteps}
            </p>
          </div>
        </div>
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>
    </main>
  );
}
