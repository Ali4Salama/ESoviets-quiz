'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ParticipantCard } from '@/components/ParticipantCard';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ResultData {
  participantId: string;
  nickname: string;
  preferredSoviet: string;
}

function safeDecode(value: string): string {
  // useSearchParams() already decodes query values; only decode legacy
  // sessionStorage entries that may still be percent-encoded.
  if (!value.includes('%')) return value;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default function ResultClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<{
    data: ResultData | null;
    error: string | null;
    duplicateWarning: boolean;
  }>({
    data: null,
    error: null,
    duplicateWarning: false,
  });

  useEffect(() => {
    const pid = searchParams.get('pid');
    const nickname = searchParams.get('nickname');
    const soviet = searchParams.get('soviet');
    const duplicate = searchParams.get('duplicate');

    // Try URL params first (primary source, written by /quiz after /api/submit)
    if (pid && nickname && soviet) {
      setState({
        data: {
          participantId: pid,
          nickname: safeDecode(nickname),
          preferredSoviet: safeDecode(soviet),
        },
        error: null,
        duplicateWarning: duplicate === '1',
      });
      return;
    }

    // Fallback: data persisted by /quiz in sessionStorage before navigation
    try {
      const stored = sessionStorage.getItem('esoviets_result');
      if (stored) {
        const parsed = JSON.parse(stored) as {
          participantId?: string;
          nickname?: string;
          preferredSoviet?: string;
          duplicate?: string;
        };
        if (parsed.participantId && parsed.nickname && parsed.preferredSoviet) {
          setState({
            data: {
              participantId: parsed.participantId,
              nickname: safeDecode(parsed.nickname),
              preferredSoviet: safeDecode(parsed.preferredSoviet),
            },
            error: null,
            duplicateWarning: parsed.duplicate === '1',
          });
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse sessionStorage:', e);
    }

    // No data available
    setState({
      data: null,
      error: 'Missing participant data. Please complete the questionnaire first.',
      duplicateWarning: false,
    });
  }, [searchParams]);

  const handleEdit = () => {
    window.location.href = '/quiz';
  };

  if (state.error) {
    return (
      <main className="min-h-screen bg-[#f6f1e5] text-stone-900 dark:bg-black dark:text-white flex flex-col" id="main-content" tabIndex={-1}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
        >
          Skip to main content
        </a>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="font-display text-2xl font-bold">Unable to Load Card</h1>
            <p className="text-stone-600 dark:text-gray-400">{state.error}</p>
            <button
              onClick={() => window.location.href = '/quiz'}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-xl border-2 transition-all duration-200 min-h-[48px] touch-manipulation bg-red-800 text-amber-50 border-stone-900 shadow-[4px_4px_0_rgba(28,25,23,0.9)] hover:brightness-110 dark:border-0 dark:bg-red-600 dark:text-white dark:shadow-none dark:hover:bg-red-500"
            >
              Start Questionnaire
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!state.data) {
    return (
      <main className="min-h-screen bg-[#f6f1e5] text-stone-900 dark:bg-black dark:text-white flex flex-col" id="main-content" tabIndex={-1}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
        >
          Skip to main content
        </a>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-stone-900/15 dark:bg-gray-800 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-stone-900/15 dark:bg-gray-800 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-stone-900/15 dark:bg-gray-800 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f1e5] text-stone-900 dark:bg-black dark:text-white flex flex-col" id="main-content" tabIndex={-1}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>
      <header className="border-b-2 border-stone-900/70 bg-[#fffdf7]/90 backdrop-blur-xl dark:border-gray-900 dark:bg-black/40">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3" role="navigation" aria-label="Main navigation">
          <span className="font-display text-xl font-bold tracking-wider">E-SOVIETS</span>
          <ThemeToggle />
        </nav>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <section className="max-w-2xl w-full text-center space-y-8" aria-labelledby="result-title">
          {state.duplicateWarning && (
            <div className="p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg text-yellow-200 text-sm" role="alert">
              We already have a response from this email. You can still submit an updated response.
            </div>
          )}

          <div className="space-y-4">
            <h1 id="result-title" className="font-display text-3xl md:text-4xl font-bold">
              Your participant card is ready.
            </h1>
            <p className="text-stone-600 dark:text-gray-300 text-base md:text-lg leading-relaxed">
              Thank you for contributing your ideas. Your responses have been recorded for the
              E-Soviets organizing process.
            </p>
          </div>

          <div className="tape space-y-3 p-6 rounded-2xl border-2 border-stone-900/70 bg-[#fffdf7] shadow-[5px_5px_0_rgba(28,25,23,0.9)] dark:bg-gray-900/50 dark:border-gray-800 dark:shadow-none">
            <div className="text-sm text-stone-500 uppercase tracking-wider dark:text-gray-400">Nickname</div>
            <div className="font-display text-xl font-bold text-stone-900 dark:text-white">{state.data?.nickname}</div>
            <div className="text-sm text-stone-500 uppercase tracking-wider mt-4 dark:text-gray-400">Participant Number</div>
            <div className="text-lg font-mono text-red-800 dark:text-red-400">{state.data?.participantId}</div>
            <div className="text-sm text-stone-500 uppercase tracking-wider mt-4 dark:text-gray-400">Preferred Soviet</div>
            <div className="text-lg font-medium text-stone-900 dark:text-white">{state.data?.preferredSoviet}</div>
          </div>

          <ParticipantCard
            nickname={state.data?.nickname || ''}
            participantId={state.data?.participantId || ''}
            preferredSoviet={state.data?.preferredSoviet || ''}
            onDownload={() => {}}
            onShare={() => {}}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-6 py-3 text-base font-medium rounded-xl border-2 transition-all duration-200 min-h-[48px] touch-manipulation bg-white text-stone-800 border-stone-900/70 hover:shadow-[3px_3px_0_rgba(28,25,23,0.9)] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-[#f6f1e5] dark:text-white dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:shadow-none dark:focus:ring-red-500 dark:focus:ring-offset-black"
            >
              Edit / Correct Response
            </button>
          </div>

          <p className="text-sm text-stone-500 dark:text-gray-500 pt-4 border-t-2 border-dashed border-stone-900/20 dark:border-gray-800 dark:border-solid w-full max-w-xs">
            <a
              href="https://rostommaskhout.substack.com/p/e-soviets-a-digital-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-800 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 underline"
            >
              Read the Full Proposal
            </a>
          </p>
        </section>
      </div>

      <footer className="border-t-2 border-stone-900/70 bg-[#fffdf7]/90 py-8 px-4 dark:border-gray-900 dark:border-t dark:bg-black/40">
        <p className="max-w-6xl mx-auto text-center text-sm text-stone-500 dark:text-gray-500">
          Completing this questionnaire expresses interest and provides information for organizing.
          It does not automatically appoint the participant as a delegate.
        </p>
      </footer>
    </main>
  );
}
