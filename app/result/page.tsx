'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ParticipantCard } from '@/components/ParticipantCard';

export const dynamic = 'force-dynamic';

interface ResultData {
  participantId: string;
  nickname: string;
  preferredSoviet: string;
}

interface ResultPageState {
  data: ResultData | null;
  error: string | null;
  duplicateWarning: boolean;
}

interface ResultPageProps {
  searchParams: Promise<{ pid?: string; nickname?: string; soviet?: string; duplicate?: string }>;
}

export default function ResultPage({ searchParams }: { searchParams: Promise<{ pid?: string; nickname?: string; soviet?: string; duplicate?: string }> }) {
  const router = useRouter();
  const [state, setState] = useState<{
    data: { participantId: string; nickname: string; preferredSoviet: string } | null;
    error: string | null;
    duplicateWarning: boolean;
  }>({
    data: null,
    error: null,
    duplicateWarning: false,
  });

  useEffect(() => {
    const loadData = async () => {
      const params = await searchParams;
      const pid = params.pid;
      const nickname = params.nickname;
      const soviet = params.soviet;
      const duplicate = params.duplicate;

      // Try URL params first
      if (pid && nickname && soviet) {
        setState({
          data: {
            participantId: pid,
            nickname: decodeURIComponent(nickname),
            preferredSoviet: decodeURIComponent(soviet),
          },
          error: null,
          duplicateWarning: duplicate === '1',
        });
        return;
      }

      // Fallback: try to get data from sessionStorage if URL params missing
      try {
        const stored = sessionStorage.getItem('esoviets_result');
        if (stored) {
          const parsed = JSON.parse(stored);
          const pid = parsed.participantId;
          const nickname = parsed.nickname;
          const soviet = parsed.preferredSoviet;
          const duplicate = parsed.duplicate;

          if (pid && nickname && soviet) {
            setState({
              data: {
                participantId: pid,
                nickname: decodeURIComponent(nickname),
                preferredSoviet: decodeURIComponent(soviet),
              },
              error: null,
              duplicateWarning: duplicate === '1',
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
    };

    loadData();
  }, []);

  const handleEdit = () => {
    window.location.href = '/quiz';
  };

  const handleDownload = () => {
    // Handled by ParticipantCard
  };

  const handleShare = () => {
    // Handled by ParticipantCard
  };

  if (state.error) {
    return (
      <main className="min-h-screen bg-black text-white flex flex-col" id="main-content" tabIndex={-1}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
        >
          Skip to main content
        </a>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center space-y-6">
            <h1 className="text-2xl font-bold">Unable to Load Card</h1>
            <p className="text-gray-400">{state.error}</p>
            <button
              onClick={() => window.location.href = '/quiz'}
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-red-600 rounded-xl hover:bg-red-500 transition-colors min-h-[48px] touch-manipulation"
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
      <main className="min-h-screen bg-black text-white flex flex-col" id="main-content" tabIndex={-1}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
        >
          Skip to main content
        </a>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-800 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-gray-800 rounded w-1/3 mx-auto" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col" id="main-content" tabIndex={-1}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>
      <header className="border-b border-gray-900">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <span className="text-xl font-bold tracking-wider">E-SOVIETS</span>
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
            <h1 id="result-title" className="text-3xl md:text-4xl font-bold">
              Your participant card is ready.
            </h1>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Thank you for contributing your ideas. Your responses have been recorded for the
              E-Soviets organizing process.
            </p>
          </div>

          <div className="space-y-3 p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
            <div className="text-sm text-gray-400 uppercase tracking-wider">Nickname</div>
            <div className="text-xl font-bold text-white">{state.data?.nickname}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-4">Participant Number</div>
            <div className="text-lg font-mono text-red-400">{state.data?.participantId}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider mt-4">Preferred Soviet</div>
            <div className="text-lg font-medium text-white">{state.data?.preferredSoviet}</div>
          </div>

          <ParticipantCard
            nickname={state.data?.nickname || ''}
            participantId={state.data?.participantId || ''}
            preferredSoviet={state.data?.preferredSoviet || ''}
            onDownload={handleDownload}
            onShare={handleShare}
          />

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              onClick={handleEdit}
              className="w-full sm:w-auto px-6 py-3 text-base font-medium text-white bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[48px] touch-manipulation"
            >
              Edit / Correct Response
            </button>
          </div>

          <p className="text-sm text-gray-500 pt-4 border-t border-gray-800 w-full max-w-xs">
            <a
              href="https://rostommaskhout.substack.com/p/e-soviets-a-digital-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline"
            >
              Read the Full Proposal
            </a>
          </p>
        </section>
      </div>

      <footer className="border-t border-gray-900 py-8 px-4">
        <p className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          Completing this questionnaire expresses interest and provides information for organizing.
          It does not automatically appoint the participant as a delegate.
        </p>
      </footer>
    </main>
  );
}

interface ResultData {
  participantId: string;
  nickname: string;
  preferredSoviet: string;
}

interface ResultPageState {
  data: ResultData | null;
  error: string | null;
  duplicateWarning: boolean;
}