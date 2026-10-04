import Link from 'next/link';
import { SovietsGrid } from '@/components/SovietsGrid';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>
      <header className="border-b border-gray-900">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <span className="text-xl font-bold tracking-wider">E-SOVIETS</span>
          <Link
            href="/quiz"
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 transition-colors hidden sm:inline-flex"
          >
            Join the questionnaire
          </Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <section className="max-w-3xl w-full text-center space-y-8 mb-16" aria-labelledby="hero-title">
          <div className="space-y-4">
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold tracking-tight">
              E-SOVIETS
            </h1>
            <p className="text-xl md:text-2xl font-medium text-red-400 tracking-wider">
              Organize. Discuss. Build.
            </p>
          </div>

          <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed">
            <p>
              E-Soviets is a proposal for a digital organization that brings people together around research,
              software, science, theory, communication, climate, health, and economic planning.
            </p>
            <p>
              This questionnaire helps us understand who is interested, what skills people can contribute,
              how much time they can volunteer, which Soviet they want to work with, and what projects
              they think should be built.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/quiz"
              className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Join the questionnaire
            </Link>
            <a
              href="https://rostommaskhout.substack.com/p/e-soviets-a-digital-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-gray-800 border border-gray-600 rounded-xl hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-colors min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Read the proposal
            </a>
          </div>
        </section>

        <SovietsGrid />
      </main>

      <footer className="border-t border-gray-900 py-8 px-4">
        <p className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          Completing this questionnaire expresses interest and provides information for organizing.
          It does not automatically appoint the participant as a delegate.
        </p>
      </footer>
    </div>
  );
}