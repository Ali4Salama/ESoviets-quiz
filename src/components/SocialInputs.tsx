'use client';

import type { ReactNode } from 'react';

export interface SocialValues {
  socialX: string;
  socialInstagram: string;
  socialTelegram: string;
  socialTiktok: string;
  socialLink: string;
}

interface SocialInputsProps {
  values: SocialValues;
  onChange: (field: keyof SocialValues, value: string) => void;
  errors?: Partial<Record<keyof SocialValues, string>>;
}

const FIELDS: {
  key: keyof SocialValues;
  label: string;
  placeholder: string;
  icon: ReactNode;
}[] = [
  {
    key: 'socialX',
    label: 'X (Twitter)',
    placeholder: '@handle or profile URL',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z" />
      </svg>
    ),
  },
  {
    key: 'socialInstagram',
    label: 'Instagram',
    placeholder: '@handle or profile URL',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" strokeWidth={1.8} />
        <circle cx="12" cy="12" r="4" strokeWidth={1.8} />
        <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    key: 'socialTelegram',
    label: 'Telegram',
    placeholder: '@handle or t.me/…',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21.9 4.6L2.7 12.1c-.8.3-.8 1.4.1 1.6l4.7 1.5 1.8 5.6c.3.9 1.4 1 1.9.2l2.6-3.1 4.9 3.6c.6.5 1.6.1 1.8-.7l3.1-14.1c.2-1-.9-1.8-1.7-1.1zM8.5 13.4l9.2-6.6c.2-.2.5.1.3.3l-7.6 7.3-.3 3-1.6-4z" />
      </svg>
    ),
  },
  {
    key: 'socialTiktok',
    label: 'TikTok / YouTube',
    placeholder: '@handle or channel URL',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M16.6 3c.4 2.1 1.8 3.6 4 3.9v3.1c-1.5 0-2.9-.5-4-1.3v6.4c0 3.7-2.6 6.4-6.1 6.4-3.4 0-6-2.6-6-6s2.7-6 6.1-6c.3 0 .7 0 1 .1v3.3c-.3-.1-.6-.2-1-.2-1.6 0-2.8 1.2-2.8 2.8s1.2 2.8 2.8 2.8c1.7 0 2.9-1.3 2.9-3.1V3h3.1z" />
      </svg>
    ),
  },
  {
    key: 'socialLink',
    label: 'Other link',
    placeholder: 'GitHub, LinkedIn, website…',
    icon: (
      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 13a5 5 0 007.5.5l3-3a5 5 0 00-7-7l-1.7 1.7M14 11a5 5 0 00-7.5-.5l-3 3a5 5 0 007 7l1.7-1.7" />
      </svg>
    ),
  },
];

export function SocialInputs({ values, onChange, errors = {} }: SocialInputsProps) {
  return (
    <div className="w-full rounded-2xl border-2 border-dashed border-stone-900/30 bg-[#fbf7ec] p-5 space-y-4 dark:border-white/10 dark:border-solid dark:bg-gradient-to-b dark:from-white/[0.05] dark:to-transparent dark:backdrop-blur-md dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-stone-900 dark:text-base dark:font-semibold dark:text-white dark:font-sans dark:tracking-wide">
          Social accounts <span className="font-mono text-xs ml-1 text-red-800 dark:text-cyan-300/90">OPTIONAL</span>
        </p>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-red-800 dark:bg-cyan-400 animate-pulse" aria-hidden="true" />
          handles or links
        </span>
      </div>

      <div className="grid gap-3">
        {FIELDS.map((field) => {
          const error = errors[field.key];
          return (
            <div key={field.key}>
              <label
                htmlFor={`social-${field.key}`}
                className="mb-1.5 flex items-center gap-2 text-sm font-medium text-stone-800 dark:text-gray-200"
              >
                <span className="text-red-800 dark:text-cyan-300/90">{field.icon}</span>
                {field.label}
              </label>
              <input
                id={`social-${field.key}`}
                name={field.key}
                type="text"
                value={values[field.key]}
                maxLength={120}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                aria-invalid={error ? 'true' : 'false'}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white text-stone-900 placeholder-stone-400 outline-none transition-all duration-200 focus:border-red-800 focus:ring-2 focus:ring-red-700/25 hover:border-stone-900/60 dark:bg-black/40 dark:text-white dark:placeholder-gray-500 dark:focus:border-cyan-400/70 dark:focus:ring-cyan-400/25 dark:focus:shadow-[0_0_20px_rgba(34,211,238,0.2)] dark:hover:border-white/25 ${
                  error ? 'border-red-700 dark:border-red-500' : 'border-stone-900/25 dark:border-white/10'
                }`}
              />
              {error && (
                <p className="mt-1.5 text-sm font-medium text-red-800 dark:text-red-300" role="alert">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="hand-note text-xs text-stone-500 leading-relaxed dark:text-gray-500 dark:not-italic dark:font-sans">
        Share only public profiles you are comfortable being contacted through. Handles (e.g. @nova) or full URLs both work.
      </p>
    </div>
  );
}
