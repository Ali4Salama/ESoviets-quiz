'use client';

import { useId, useState } from 'react';

interface MultiSelectOption {
  value: string;
  label: string;
}

interface Category {
  category: string;
  options: MultiSelectOption[];
}

interface MultiSelectProps {
  name: string;
  label: string;
  options?: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  error?: string;
  required?: boolean;
  categorized?: boolean;
  categories?: Category[];
}

export function MultiSelect({
  name,
  label,
  options = [],
  value,
  onChange,
  maxSelections,
  error,
  required = true,
  categorized = false,
  categories = [],
}: MultiSelectProps) {
  const required_ = required ?? true;
  const groupId = useId();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(() => {
    if (categorized && categories.length > 0) {
      return new Set(categories.map(c => c.category));
    }
    return new Set();
  });

  const isMaxReached = Boolean(maxSelections && value.length >= maxSelections);
  const isSelected = (optValue: string) => value.includes(optValue);
  const isDisabled = (optValue: string) => isMaxReached && !isSelected(optValue);

  const toggle = (optValue: string) => {
    if (isDisabled(optValue)) return;
    onChange(isSelected(optValue)
      ? value.filter(v => v !== optValue)
      : [...value, optValue]);
  };

  const handleKeyDown = (e: React.KeyboardEvent, optValue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(optValue);
    }
  };

  const getGroups = () => {
    if (categorized && categories.length > 0) return categories;
    return [{ category: '', options }];
  };

  return (
    <fieldset className={`w-full ${error ? 'error' : ''}`} aria-describedby={error ? `${groupId}-error` : undefined}>
      <legend className="mb-4 flex items-center justify-between gap-4">
        <span className="text-lg font-medium text-white flex items-center gap-2">
          {label}
          {required_ && <span className="text-red-400" aria-hidden="true">*</span>}
        </span>
        {maxSelections && (
          <span className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-mono border ${
            value.length >= (maxSelections || 0)
              ? 'text-red-400 bg-red-500/10 border-red-500/30'
              : 'text-gray-400 border-gray-700 bg-gray-800'
          }`}>
            {value.length} / {maxSelections} selected
          </span>
        )}
      </legend>

      <div role="group" aria-label={label} className="space-y-5">
        {getGroups().map((cat, catIndex) => (
          <div key={cat.category || catIndex} className="space-y-3">
            {cat.category && (
              <button
                type="button"
                onClick={() => setExpandedCategories(prev => {
                  const next = new Set(prev);
                  next.has(cat.category) ? next.delete(cat.category) : next.add(cat.category);
                  return next;
                })}
                className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-md border border-white/10 hover:border-cyan-300/30 hover:bg-white/[0.07] transition-all duration-200 text-left"
                aria-expanded={expandedCategories.has(cat.category)}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 flex-shrink-0">
                    <svg
                      className={`w-full h-full text-gray-400 transition-transform duration-200 ${expandedCategories.has(cat.category) ? 'rotate-90' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  <span className="font-semibold text-white text-base">{cat.category}</span>
                </div>
                <span className="text-xs font-mono text-gray-500 px-2 py-0.5 rounded-full bg-gray-800 whitespace-nowrap">
                  {cat.options.filter(o => value.includes(o.value)).length} / {cat.options.length}
                </span>
              </button>
            )}

            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-out ${
                cat.category && !expandedCategories.has(cat.category)
                  ? 'max-h-0 opacity-0 -mt-3 pointer-events-none'
                  : 'max-h-[70vh] overflow-y-auto opacity-100'
              }`}
            >
              {cat.options.map((option, optIndex) => {
                const selected = value.includes(option.value);
                const disabled = isMaxReached && !selected;
                const optionId = `${groupId}-${catIndex}-${optIndex}`;
                const isFirstRequired = required_ && optIndex === 0 && catIndex === 0;

                return (
                  <label
                    key={option.value}
                    htmlFor={optionId}
                    className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 backdrop-blur-md transition-all duration-200 cursor-pointer touch-manipulation min-h-[56px] ${
                      disabled
                        ? 'border-white/10 bg-white/[0.02] opacity-50 cursor-not-allowed'
                        : value.includes(option.value)
                        ? 'border-red-500/70 bg-gradient-to-r from-red-500/15 to-fuchsia-500/10 shadow-[0_0_24px_rgba(220,38,38,0.22),inset_0_1px_0_rgba(255,255,255,0.08)]'
                        : 'border-white/10 bg-white/[0.03] hover:border-cyan-300/40 hover:bg-white/[0.06] hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                    } focus-within:border-cyan-300/60 focus-within:ring-2 focus-within:ring-cyan-400/25 ${error && !cat.category ? 'border-red-500' : ''}`}
                  >
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <input
                        type="checkbox"
                        id={optionId}
                        name={name}
                        value={option.value}
                        checked={value.includes(option.value)}
                        onChange={() => toggle(option.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggle(option.value);
                          }
                        }}
                        disabled={disabled}
                        className="sr-only peer"
                        required={required_ && catIndex === 0 && optIndex === 0}
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        disabled
                          ? 'border-gray-600 bg-gray-800'
                          : value.includes(option.value)
                          ? 'border-red-500 bg-red-500 shadow-[0_0_0_2px_rgba(204,0,0,0.3)]'
                          : 'border-gray-500 bg-gray-800 hover:border-gray-400'
                      }`} aria-hidden="true">
                        {value.includes(option.value) && (
                          <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-500 peer-focus:ring-offset-2 peer-focus:ring-offset-black rounded-xl py-1">
                      <span className={`font-medium text-white ${disabled ? 'text-gray-500' : ''}`}>{option.label}</span>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 opacity-0 peer-hover:opacity-100 peer-focus:opacity-100 transition-opacity duration-200" aria-hidden="true">
                      {value.includes(option.value) && (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <p id={`${groupId}-error`} className="mt-3 text-sm text-red-300 flex items-center gap-1.5" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 101.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 0z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </fieldset>
  );
}