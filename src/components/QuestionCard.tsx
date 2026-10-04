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
    <main className="min-h-screen bg-black flex flex-col" id="main-content">
      <QuizProgress
        currentStep={step}
        totalSteps={totalSteps}
        completedSteps={completedSteps}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-8 w-full max-w-2xl mx-auto">
        <div className="w-full space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            {description && (
              <p className="text-gray-400 text-base md:text-lg">{description}</p>
            )}
          </header>

          {error && (
            <div
              role="alert"
              className="p-4 bg-red-900/30 border border-red-600 rounded-lg text-red-200 text-sm"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="space-y-4">{children}</div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            {canGoBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-4 text-base font-medium text-white bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[44px] touch-manipulation"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={onNext}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[44px] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit & Generate My Participant Card' : 'Next'}
            </button>
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