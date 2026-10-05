'use client';

import type { ReactNode } from 'react';
import { QuizProgress } from './QuizProgress';
import { ThemeToggle } from './ThemeToggle';

interface QuestionCardProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
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
    <main className="relative min-h-screen bg-[#f6f1e5] text-stone-900 flex flex-col overflow-hidden dark:bg-[#05070d] dark:text-white" id="main-content">
      {/* Ambient background (neon orbs visible in dark mode via CSS) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="quiz-grid-bg absolute inset-0" />
        <div className="quiz-orb-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-red-600/20 blur-[130px]" />
        <div className="quiz-orb-b absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[220px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-800/40 to-transparent dark:via-cyan-400/60" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="w-full max-w-2xl mx-auto px-4 pt-4 flex items-center justify-between gap-3">
          <span className="font-display text-lg font-bold tracking-wide">
            <span className="text-red-800 dark:text-red-500" aria-hidden="true">★</span> E-Soviets
          </span>
          <ThemeToggle />
        </div>

        <QuizProgress
          currentStep={step}
          totalSteps={totalSteps}
          completedSteps={completedSteps}
        />

        <div className="flex-1 flex items-center justify-center px-4 py-8 w-full max-w-2xl mx-auto">
          <div className="tape w-full rounded-2xl border-2 border-stone-900/70 bg-[#fffdf7] shadow-[5px_5px_0_rgba(28,25,23,0.9)] p-6 sm:p-10 space-y-7 dark:rounded-3xl dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <header className="text-center space-y-3">
              <p className="hand-note text-sm text-stone-500 dark:text-cyan-200/80">
                field notes · entry {step} of {totalSteps}
              </p>
              <h1 className="font-display text-3xl md:text-4xl leading-tight font-bold text-stone-900 dark:text-white dark:bg-gradient-to-b dark:from-white dark:to-white/70 dark:bg-clip-text dark:text-transparent">
                {title}
              </h1>
              <svg className="squiggle text-red-800 dark:text-cyan-300" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                <path d="M3 8 C 30 3, 55 10, 82 6 S 135 3, 162 7 S 200 9, 217 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              {description && (
                <p className="text-stone-600 text-base md:text-lg max-w-xl mx-auto dark:text-gray-400">{description}</p>
              )}
            </header>

            <hr className="border-t-2 border-dashed border-stone-900/20 dark:border-white/10" />

            {error && (
              <div
                role="alert"
                className="p-4 bg-red-50 border-2 border-red-700/60 rounded-xl text-red-900 text-sm dark:bg-red-900/30 dark:border-red-500/50 dark:text-red-200 dark:shadow-[0_0_28px_rgba(220,38,38,0.25)]"
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
                  className="w-full sm:w-auto px-6 py-4 text-base font-medium rounded-xl border-2 transition-all duration-200 min-h-[44px] touch-manipulation disabled:opacity-50 bg-white text-stone-800 border-stone-900/70 hover:bg-stone-100 hover:shadow-[3px_3px_0_rgba(28,25,23,0.9)] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-[#fffdf7] dark:bg-white/5 dark:text-gray-200 dark:border-white/15 dark:hover:bg-white/10 dark:hover:border-white/25 dark:hover:shadow-none dark:focus:ring-cyan-400/60 dark:focus:ring-offset-black"
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={onNext}
                disabled={isSubmitting}
                className="group relative w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl overflow-hidden border-2 transition-all duration-200 min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed bg-red-800 text-amber-50 border-stone-900 shadow-[4px_4px_0_rgba(28,25,23,0.9)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_rgba(28,25,23,0.9)] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-[#fffdf7] dark:border-0 dark:bg-gradient-to-r dark:from-red-700 dark:via-red-600 dark:to-orange-600 dark:text-white dark:shadow-[0_8px_36px_rgba(220,38,38,0.45)] dark:hover:shadow-[0_8px_48px_rgba(220,38,38,0.6)] dark:hover:brightness-110 dark:hover:translate-x-0 dark:hover:translate-y-0 dark:focus:ring-red-500 dark:focus:ring-offset-black"
              >
                <span className="relative z-10">
                  {isSubmitting ? 'Transmitting…' : isLastStep ? 'Submit & Generate My Participant Card' : 'Continue →'}
                </span>
                <span className="progress-shimmer absolute inset-0" aria-hidden="true" />
              </button>
            </div>

            <p className="hand-note text-center text-sm text-stone-500 dark:text-gray-500">
              — take your time, comrade; there are no wrong answers —
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
