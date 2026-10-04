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
      <label htmlFor={groupId} className="block text-lg font-medium text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
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
        className={`w-full min-h-[120px] px-4 py-3 rounded-xl border-2 bg-black/40 backdrop-blur-md text-white placeholder-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] focus:outline-none focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-300/60 focus:shadow-[0_0_24px_rgba(34,211,238,0.2)] transition-all duration-200 resize-none ${
          error
            ? 'border-red-500'
            : isAtLimit
            ? 'border-red-500'
            : isNearLimit
            ? 'border-yellow-500'
            : 'border-white/10 hover:border-white/25'
        }`}
      />

      <div className="flex items-center justify-between mt-2">
        {helperText && (
          <p id={helperId} className="text-sm text-gray-400">
            {helperText}
          </p>
        )}
        {maxLength && (
          <span
            className={`text-sm font-mono transition-colors ${
              isAtLimit ? 'text-red-400' : isNearLimit ? 'text-yellow-400' : 'text-gray-500'
            }`}
            aria-live="polite"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}

      {minLength && !error && charCount > 0 && charCount < minLength && (
        <p className="mt-2 text-sm text-yellow-300" role="status">
          Minimum {minLength} characters (currently {charCount})
        </p>
      )}
    </div>
  );
}