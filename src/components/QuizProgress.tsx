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
    <nav aria-label="Quiz progress" className="w-full max-w-2xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between gap-4 mb-2">
        <span className="text-sm font-medium text-white">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm text-gray-400" aria-live="polite">
          {progressPercent}% complete
        </span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={stepPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Quiz progress"
        className="w-full h-2 bg-gray-800 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-red-600 transition-all duration-300 ease-out"
          style={{ width: `${stepPercent}%` }}
        />
      </div>
      <p className="sr-only">
        Currently on step {currentStep} of {totalSteps}. {progressPercent} percent complete.
      </p>
    </nav>
  );
}