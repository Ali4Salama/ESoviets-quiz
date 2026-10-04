import Link from 'next/link';
import { SovietsGrid } from '@/components/SovietsGrid';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#05070d] text-white flex flex-col overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="quiz-grid-bg absolute inset-0" />
        <div className="quiz-orb-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-red-600/20 blur-[130px]" />
        <div className="quiz-orb-b absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[220px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>

      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between" role="navigation" aria-label="Main navigation">
          <span className="flex items-center gap-2.5 text-xl font-bold tracking-wider">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-red-800 shadow-[0_0_20px_rgba(220,38,38,0.5)] text-sm" aria-hidden="true">
              ★
            </span>
            E-SOVIETS
          </span>
          <Link
            href="/quiz"
            className="px-4 py-2 text-sm font-medium text-white rounded-lg border border-red-500/50 bg-red-600/20 hover:bg-red-600/40 hover:border-red-400 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all duration-200 hidden sm:inline-flex"
          >
            Begin intake
          </Link>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <section className="max-w-3xl w-full text-center rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] p-6 sm:p-12 space-y-8 mb-16" aria-labelledby="hero-title">
          <div className="space-y-5">
            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/25 bg-cyan-400/10 text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" aria-hidden="true" />
              Revolutionary Digital Vanguard
            </p>
            <h1 id="hero-title" className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white via-white to-white/60 bg-clip-text text-transparent drop-shadow-[0_0_36px_rgba(220,38,38,0.35)]">
              E-SOVIETS
            </h1>
            <p className="text-xl md:text-2xl font-medium tracking-wider bg-gradient-to-r from-red-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Organize. Discuss. Build.
            </p>
          </div>

          <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
            <p>
              E-Soviets is a revolutionary digital vanguard uniting Marxists to advance scientific
              socialism, reorganize global resources, restructure the economy, and restore planetary
              balance through advanced technology and cybernetic planning.
            </p>
            <p>
              This intake form evaluates your political commitment, technical capacities, available
              hours for revolutionary praxis, preferred Soviet assignment, and strategic proposals to
              construct the material infrastructure of our post-capitalist future.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              href="/quiz"
              className="group relative w-full sm:w-auto px-8 py-4 text-base font-semibold text-white rounded-xl overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-orange-600 shadow-[0_8px_36px_rgba(220,38,38,0.45)] hover:shadow-[0_8px_48px_rgba(220,38,38,0.6)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Begin the intake form
              </span>
              <span className="progress-shimmer absolute inset-0" aria-hidden="true" />
            </Link>
            <a
              href="https://rostommaskhout.substack.com/p/e-soviets-a-digital-organization"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-200 bg-white/5 border border-white/15 rounded-xl hover:bg-white/10 hover:border-cyan-300/40 hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 min-h-[48px] touch-manipulation flex items-center justify-center gap-2"
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

      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl py-8 px-4">
        <p className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          Completing this intake form expresses interest and provides information for organizing.
          It does not automatically appoint the participant as a delegate.
        </p>
      </footer>
    </div>
  );
}
