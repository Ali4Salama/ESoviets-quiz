'use client';

import { useId, useRef, useEffect } from 'react';

interface TextQuestionProps {
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  minLength?: number;
  maxLength?: number;
  helperText?: string;
  error?: string;
  required?: boolean;
}

export function TextQuestion({
  name,
  label,
  placeholder,
  value,
  onChange,
  minLength,
  maxLength,
  helperText,
  error,
  required = true,
}: TextQuestionProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const groupId = useId();
  const helperId = `${groupId}-helper`;
  const errorId = `${groupId}-error`;

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let newValue = e.target.value;
    if (maxLength && newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength);
    }
    onChange(newValue);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (!maxLength) return;
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newValue = value + pastedText;
    if (newValue.length > maxLength) {
      onChange(newValue.slice(0, maxLength));
    } else {
      onChange(newValue);
    }
  };

  const charCount = value.length;
  const isNearLimit = maxLength && charCount > maxLength * 0.85;
  const isAtLimit = maxLength && charCount >= maxLength;

  return (
    <div className="w-full">
      <label htmlFor={groupId} className="font-display block text-xl font-bold text-stone-900 mb-2 dark:text-white">
        {label}
        {required && <span className="text-red-700 dark:text-red-400 ml-1" aria-hidden="true">*</span>}
      </label>

      <textarea
        ref={textareaRef}
        id={groupId}
        name={name}
        value={value}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        aria-describedby={[
          helperText ? helperId : undefined,
          error ? errorId : undefined,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full min-h-[120px] px-4 py-3 rounded-xl border-2 text-stone-900 placeholder-stone-400 shadow-[inset_2px_2px_0_rgba(28,25,23,0.06)] focus:outline-none focus:ring-2 focus:ring-red-700/40 focus:border-red-800 transition-all duration-200 resize-none dark:backdrop-blur-md dark:text-white dark:placeholder-gray-500 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:focus:ring-cyan-400/40 dark:focus:border-cyan-300/60 dark:focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] ${
          error || isAtLimit
            ? 'bg-red-50 border-red-700 dark:bg-black/40 dark:border-red-500'
            : isNearLimit
              ? 'bg-white border-amber-600 dark:bg-black/40 dark:border-yellow-500'
              : 'bg-white border-stone-900/25 hover:border-stone-900/60 dark:bg-black/40 dark:border-white/10 dark:hover:border-white/25'
        }`}
      />

      <div className="flex items-center justify-between mt-2">
        {helperText && (
          <p id={helperId} className="hand-note text-sm text-stone-500 dark:text-gray-400 dark:not-italic dark:font-sans">
            {helperText}
          </p>
        )}
        {maxLength && (
          <span
            className={`text-sm font-mono transition-colors ${
              isAtLimit ? 'text-red-700 dark:text-red-400' : isNearLimit ? 'text-amber-700 dark:text-yellow-400' : 'text-stone-400 dark:text-gray-500'
            }`}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-red-800 dark:text-red-300" role="alert">
          {error}
        </p>
      )}

      {minLength && !error && charCount > 0 && charCount < minLength && (
        <p className="mt-2 text-sm text-amber-700 dark:text-yellow-300" role="status">
          Minimum {minLength} characters (currently {charCount})
        </p>
      )}
    </div>
  );
}