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
    <nav aria-label="Quiz progress" className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-gray-300 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-red-500 to-cyan-400 animate-pulse" aria-hidden="true" />
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-mono text-cyan-200/90" aria-live="polite">
          {progressPercent}% complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={stepPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
        className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]"
      >
        <div
          className="progress-shimmer h-full rounded-full bg-gradient-to-r from-red-600 via-fuchsia-500 to-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.6)] transition-all duration-500 ease-out"
          style={{ width: `${stepPercent}%` }}
        />
      </div>
      <p className="sr-only">
        Currently on step {currentStep} of {totalSteps}. {progressPercent} percent complete.
      </p>
    </nav>
  );
}
