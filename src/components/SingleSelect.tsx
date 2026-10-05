'use client';

import { useId } from 'react';

interface SingleSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SingleSelectProps {
  name: string;
  label: string;
  options: SingleSelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function SingleSelect({
  name,
  label,
  options,
  value,
  onChange,
  error,
  required = true,
}: SingleSelectProps) {
  const groupId = useId();
  const describedById = error ? `${groupId}-error` : undefined;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const optionsArray = Array.from(
      e.currentTarget.closest('fieldset')?.querySelectorAll('input[type="radio"]') || []
    );
    const currentIndex = optionsArray.indexOf(e.currentTarget as HTMLInputElement);

    let newIndex = currentIndex;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      newIndex = (currentIndex + 1) % optionsArray.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      newIndex = (currentIndex - 1 + optionsArray.length) % optionsArray.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newIndex = optionsArray.length - 1;
    }

    if (newIndex !== currentIndex) {
      const target = optionsArray[newIndex] as HTMLInputElement;
      target.focus();
      target.click();
    }
  };

  return (
    <fieldset
      className={`w-full space-y-3 ${error ? 'error' : ''}`}
      aria-describedby={describedById}
    >
      <legend className="font-display text-xl font-bold text-stone-900 mb-2 dark:text-white">
        {label}
        {required && <span className="text-red-700 dark:text-red-400 ml-1" aria-hidden="true">*</span>}
      </legend>

      <div className="space-y-2" role="radiogroup" aria-label={label}>
        {options.map((option, index) => {
          const optionId = `${groupId}-option-${index}`;
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={`relative flex items-center gap-3 pl-3 pr-4 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer touch-manipulation min-h-[44px] overflow-hidden dark:backdrop-blur-md ${
                error
                  ? 'border-red-700 bg-red-50 dark:border-red-500 dark:bg-red-500/10'
                  : isSelected
                    ? 'border-red-800 bg-red-50 shadow-[3px_3px_0_rgba(28,25,23,0.9)] ring-2 ring-red-800/25 dark:border-red-400 dark:bg-gradient-to-r dark:from-red-500/20 dark:to-fuchsia-500/10 dark:shadow-[0_0_28px_rgba(220,38,38,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] dark:ring-2 dark:ring-red-400/30'
                    : 'bg-white border-stone-900/25 hover:border-stone-900/60 hover:shadow-[3px_3px_0_rgba(28,25,23,0.85)] dark:bg-white/[0.03] dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.06]'
              } focus-within:border-red-800 dark:focus-within:border-cyan-300/60 dark:focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]`}
            >
              {/* Selection accent bar — always rendered so layout never shifts */}
              <span
                aria-hidden="true"
                className={`w-1.5 self-stretch rounded-full transition-colors duration-200 ${
                  isSelected ? 'bg-red-800 dark:bg-red-400' : 'bg-stone-900/10 dark:bg-white/10'
                }`}
              />
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                onKeyDown={handleKeyDown}
                className="sr-only peer"
                required={required && index === 0}
                aria-describedby={option.description ? `${optionId}-desc` : undefined}
              />
              <div className="flex flex-col flex-1 min-w-0 rounded-lg">
                <span className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-stone-900 dark:text-white">{option.label}</span>
                  {isSelected && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-red-800 text-amber-50 dark:bg-red-500 dark:text-white">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </span>
                  )}
                </span>
                {option.description && (
                  <span id={`${optionId}-desc`} className="text-sm text-stone-500 mt-0.5 dark:text-gray-400">
                    {option.description}
                  </span>
                )}
              </div>
              <div
                className={`rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isSelected
                    ? 'w-7 h-7 border-red-800 bg-red-800 shadow-[0_0_12px_rgba(153,27,27,0.5)] dark:border-red-400 dark:bg-red-500 dark:shadow-[0_0_16px_rgba(239,68,68,0.6)]'
                    : 'w-6 h-6 bg-white border-stone-500 dark:bg-transparent dark:border-gray-500'
                }`}
                aria-hidden="true"
              >
                {isSelected ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-stone-900/15 dark:bg-white/20" />
                )}
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p id={describedById} className="text-sm font-medium text-red-800 dark:text-red-300" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}