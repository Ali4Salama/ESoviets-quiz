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
              className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer touch-manipulation min-h-[44px] dark:backdrop-blur-md ${
                error
                  ? 'border-red-700 bg-red-50 dark:border-red-500 dark:bg-red-500/10'
                  : isSelected
                    ? 'border-red-800 bg-red-50 shadow-[3px_3px_0_rgba(28,25,23,0.9)] dark:border-red-500/70 dark:bg-gradient-to-r dark:from-red-500/15 dark:to-fuchsia-500/10 dark:shadow-[0_0_24px_rgba(220,38,38,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]'
                    : 'bg-white border-stone-900/25 hover:border-stone-900/60 hover:shadow-[3px_3px_0_rgba(28,25,23,0.85)] dark:bg-white/[0.03] dark:hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] dark:hover:border-cyan-300/40 dark:hover:bg-white/[0.06]'
              } focus-within:border-red-800 dark:focus-within:border-cyan-300/60 dark:focus-within:shadow-[0_0_20px_rgba(34,211,238,0.25)]`}
            >
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
              <div
                className={`flex flex-col flex-1 min-w-0 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 peer-focus:ring-offset-2 peer-focus:ring-offset-black rounded-lg ${
                  isSelected ? 'bg-red-500/5' : ''
                }`}
              >
                <span className="font-medium text-stone-900 dark:text-white">{option.label}</span>
                {option.description && (
                  <span id={`${optionId}-desc`} className="text-sm text-stone-500 mt-0.5 dark:text-gray-400">
                    {option.description}
                  </span>
                )}
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  isSelected
                    ? 'border-red-800 bg-red-800 dark:border-red-500 dark:bg-red-500'
                    : 'bg-white border-stone-500 dark:bg-transparent dark:border-gray-500'
                }`}
                aria-hidden="true"
              >
                {isSelected && (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
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