'use client';

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
}

export function QuizProgress({ currentStep, totalSteps, completedSteps }: QuizProgressProps) {
  const progressPercent = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const stepPercent = totalSteps > 0 ? Math.round((currentStep / totalSteps) * 100) : 0;

  return (
    <nav aria-label="Quiz progress" className="w-full max-w-2xl mx-auto px-4 pt-4 pb-2">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border-2 border-stone-900/70 bg-[#fffdf7] text-stone-800 shadow-[2px_2px_0_rgba(28,25,23,0.9)] dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-md dark:text-gray-300 dark:shadow-none dark:font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-red-800 dark:bg-gradient-to-r dark:from-red-500 dark:to-cyan-400 animate-pulse" aria-hidden="true" />
          Step {currentStep} of {totalSteps}
        </span>
        <span className="hand-note text-sm text-stone-600 dark:text-cyan-200/90 dark:not-italic dark:font-mono" aria-live="polite">
          {progressPercent}% complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={stepPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
        className="w-full h-2.5 rounded-full overflow-hidden border-2 border-stone-900/70 bg-stone-900/10 dark:border-white/10 dark:bg-white/10 dark:shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
      >
        <div
          className="progress-shimmer h-full rounded-full bg-red-800 dark:bg-gradient-to-r dark:from-red-600 dark:via-fuchsia-500 dark:to-cyan-400 dark:shadow-[0_0_16px_rgba(34,211,238,0.6)] transition-all duration-500 ease-out"
          style={{ width: `${stepPercent}%` }}
        />
      </div>
      <p className="sr-only">
        Currently on step {currentStep} of {totalSteps}. {progressPercent} percent complete.
      </p>
    </nav>
  );
}
