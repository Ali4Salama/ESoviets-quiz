'use client';

import { useId, useMemo, useRef, useState, useEffect, type KeyboardEvent } from 'react';

interface CountrySelectProps {
  name: string;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export function CountrySelect({
  name,
  label,
  value,
  options,
  onChange,
  error,
  required = true,
  placeholder = 'Search and select your country…',
}: CountrySelectProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const listId = `${groupId}-list`;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((c) => c.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const select = (country: string) => {
    onChange(country);
    setQuery('');
    setOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, Math.max(filtered.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && filtered[highlight]) {
        e.preventDefault();
        select(filtered[highlight]);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      <label htmlFor={groupId} className="block text-lg font-medium text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-300/80" aria-hidden="true">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-7-5.5-7-11a7 7 0 1114 0c0 5.5-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
        </span>
        <input
          ref={inputRef}
          id={groupId}
          name={name}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open && filtered[highlight] ? `${listId}-${highlight}` : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? 'true' : 'false'}
          value={open ? query : value}
          placeholder={value && !open ? value : placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (value) onChange('');
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className={`w-full pl-12 pr-11 py-3.5 rounded-xl border-2 bg-white/[0.04] backdrop-blur-md text-white placeholder-gray-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] outline-none transition-all duration-200 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/30 focus:shadow-[0_0_24px_rgba(34,211,238,0.25)] hover:border-white/25 ${
            error ? 'border-red-500' : 'border-white/10'
          }`}
        />
        {value && !open ? (
          <button
            type="button"
            onClick={() => onChange('')}
            aria-label="Clear country selection"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        ) : (
          <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        )}

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label="Countries"
            className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto rounded-xl border border-white/10 bg-[#0b0f1a]/95 backdrop-blur-xl shadow-[0_16px_60px_rgba(0,0,0,0.6),0_0_32px_rgba(34,211,238,0.12)] p-1.5 futuristic-scroll"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-400">No country matches “{query}”.</li>
            )}
            {filtered.map((country, i) => {
              const selected = country === value;
              return (
                <li key={country}>
                  <button
                    id={`${listId}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => select(country)}
                    className={`w-full text-left px-4 py-2.5 rounded-lg text-[15px] transition-all duration-150 flex items-center justify-between gap-3 ${
                      i === highlight
                        ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-white'
                        : selected
                          ? 'text-cyan-200'
                          : 'text-gray-200 hover:bg-white/5'
                    }`}
                  >
                    <span>{country}</span>
                    {selected && (
                      <svg className="w-4 h-4 text-cyan-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {value && !open && (
        <p className="mt-2 text-sm text-cyan-200/80" role="status">
          Selected: <span className="font-medium text-cyan-100">{value}</span>
        </p>
      )}

      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
