import Link from 'next/link';
import { SovietsGrid } from '@/components/SovietsGrid';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#f6f1e5] text-stone-900 flex flex-col overflow-hidden dark:bg-[#05070d] dark:text-white">
      {/* Ambient background (neon orbs visible in dark mode via CSS) */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="quiz-grid-bg absolute inset-0" />
        <div className="quiz-orb-a absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-red-600/20 blur-[130px]" />
        <div className="quiz-orb-b absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/15 blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[720px] h-[220px] rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-800/40 to-transparent dark:via-cyan-400/60" />
      </div>

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-red-600 text-white rounded"
      >
        Skip to main content
      </a>

      <header className="relative z-10 border-b-2 border-stone-900/70 bg-[#fffdf7]/90 backdrop-blur-xl sticky top-0 dark:border-white/10 dark:bg-black/40">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-3" role="navigation" aria-label="Main navigation">
          <span className="font-display flex items-center gap-2.5 text-xl font-bold tracking-wide">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-800 text-amber-50 border-2 border-stone-900 shadow-[2px_2px_0_rgba(28,25,23,0.9)] text-sm dark:border-0 dark:bg-gradient-to-br dark:from-red-600 dark:to-red-800 dark:shadow-[0_0_20px_rgba(220,38,38,0.5)]" aria-hidden="true">
              ★
            </span>
            E-SOVIETS
          </span>
          <span className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/quiz"
              className="px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200 hidden sm:inline-flex bg-white text-stone-900 border-stone-900/70 hover:shadow-[2px_2px_0_rgba(28,25,23,0.9)] dark:border-red-500/50 dark:bg-red-600/20 dark:text-white dark:hover:bg-red-600/40 dark:hover:border-red-400 dark:hover:shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              Begin intake
            </Link>
          </span>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <section className="tape max-w-3xl w-full text-center rounded-2xl border-2 border-stone-900/70 bg-[#fffdf7] shadow-[6px_6px_0_rgba(28,25,23,0.9)] p-6 sm:p-12 space-y-8 mb-16 dark:rounded-3xl dark:border-white/10 dark:bg-white/[0.03] dark:backdrop-blur-xl dark:shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]" aria-labelledby="hero-title">
          <div className="space-y-5">
            <p>
              <span className="stamp text-red-800 dark:text-cyan-200">★ Revolutionary Digital Vanguard ★</span>
            </p>
            <h1 id="hero-title" className="font-display text-5xl md:text-7xl font-bold tracking-tight text-stone-900 dark:bg-gradient-to-b dark:from-white dark:via-white dark:to-white/60 dark:bg-clip-text dark:text-transparent dark:drop-shadow-[0_0_36px_rgba(220,38,38,0.35)]">
              E-SOVIETS
            </h1>
            <div>
              <p className="font-display text-xl md:text-2xl font-bold italic tracking-wide text-red-800 dark:not-italic dark:font-medium dark:bg-gradient-to-r dark:from-red-400 dark:via-fuchsia-300 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent">
                Organize. Discuss. Build.
              </p>
              <svg className="squiggle text-red-800 dark:text-cyan-300" viewBox="0 0 220 12" fill="none" aria-hidden="true">
                <path d="M3 8 C 30 3, 55 10, 82 6 S 135 3, 162 7 S 200 9, 217 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          <div className="space-y-4 text-stone-700 text-base md:text-lg leading-relaxed max-w-2xl mx-auto dark:text-gray-300">
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
              className="group relative w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl overflow-hidden border-2 transition-all duration-200 min-h-[48px] touch-manipulation flex items-center justify-center gap-2 bg-red-800 text-amber-50 border-stone-900 shadow-[4px_4px_0_rgba(28,25,23,0.9)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_rgba(28,25,23,0.9)] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-[#fffdf7] dark:border-0 dark:bg-gradient-to-r dark:from-red-700 dark:via-red-600 dark:to-orange-600 dark:text-white dark:shadow-[0_8px_36px_rgba(220,38,38,0.45)] dark:hover:shadow-[0_8px_48px_rgba(220,38,38,0.6)] dark:hover:brightness-110 dark:hover:translate-x-0 dark:hover:translate-y-0 dark:focus:ring-red-500 dark:focus:ring-offset-black"
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
              className="w-full sm:w-auto px-8 py-4 text-base font-medium rounded-xl border-2 transition-all duration-200 min-h-[48px] touch-manipulation flex items-center justify-center gap-2 bg-white text-stone-800 border-stone-900/70 hover:shadow-[3px_3px_0_rgba(28,25,23,0.9)] focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-offset-2 focus:ring-offset-[#fffdf7] dark:bg-white/5 dark:text-gray-200 dark:border-white/15 dark:hover:bg-white/10 dark:hover:border-cyan-300/40 dark:hover:shadow-[0_0_24px_rgba(34,211,238,0.25)] dark:hover:shadow-none dark:focus:ring-cyan-400/60 dark:focus:ring-offset-black"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Read the proposal
            </a>
          </div>

          <p className="hand-note text-sm text-stone-500 dark:text-gray-500">
            — handwritten with care · no trackers, no ads —
          </p>
        </section>

        <SovietsGrid />
      </main>

      <footer className="relative z-10 border-t-2 border-stone-900/70 bg-[#fffdf7]/90 backdrop-blur-xl py-8 px-4 dark:border-white/10 dark:bg-black/40">
        <p className="max-w-6xl mx-auto text-center text-sm text-stone-500 dark:text-gray-500">
          Completing this intake form expresses interest and provides information for organizing.
          It does not automatically appoint the participant as a delegate.
        </p>
      </footer>
    </div>
  );
}
