'use client';

interface Soviet {
  id: string;
  name: string;
  shortName: string;
  work: string[];
}

const soviets: Soviet[] = [
  {
    id: 'agitprop',
    name: 'Agitprop & Counter-Propaganda Soviet',
    shortName: 'Agitprop',
    work: ['Media research', 'Content adaptation', 'Educational content', 'Audience research', 'Media production', 'Communication strategy'],
  },
  {
    id: 'ai-software',
    name: 'AI & Software Soviet',
    shortName: 'AI & Software',
    work: ['AI tools', 'Software development', 'Cybersecurity', 'Data analysis', 'AI-assisted development', 'Video/media automation'],
  },
  {
    id: 'marxist-theory',
    name: 'Marxist Theory Soviet',
    shortName: 'Marxist Theory',
    work: ['Philosophy', 'Political economy', 'Historical analysis', 'Technology ethics', 'Contemporary theory', 'Education'],
  },
  {
    id: 'geo-climate',
    name: 'Geo-Engineering & Climate Soviet',
    shortName: 'Geo-Engineering',
    work: ['Climate research', 'Energy', 'Carbon capture', 'Waste and pollution', 'Ocean cleanup', 'Geological risk research'],
  },
  {
    id: 'health-wellbeing',
    name: 'Human Health & Wellbeing Soviet',
    shortName: 'Health & Wellbeing',
    work: ['Health research', 'Food systems', 'Biotechnology', 'Public health', 'Health technology', 'Scientific research'],
  },
  {
    id: 'cybernetic-economy',
    name: 'Cybernetic Economy Soviet',
    shortName: 'Cybernetic Economy',
    work: ['Resource planning', 'Supply chains', 'Economic modeling', 'Optimization', 'Data networks', 'Economic cybernetics'],
  },
];

export function SovietsGrid() {
  return (
    <section aria-labelledby="soviets-heading" className="w-full max-w-6xl mx-auto px-4">
      <h2 id="soviets-heading" className="sr-only">
        Proposed Soviets
      </h2>
      <p className="text-center text-sm text-gray-400 mb-6 uppercase tracking-wider">
        Proposed Soviets
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" role="list">
        {soviets.map((soviet) => (
          <li key={soviet.id} className="group">
            <article
              className="h-full p-5 rounded-xl border-2 bg-gray-900/50 border-gray-700 hover:border-red-500/50 hover:bg-gray-900 transition-all duration-300 flex flex-col"
              tabIndex={0}
              role="button"
              aria-label={`Learn more about ${soviet.name}`}
            >
              <header className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-red-300 transition-colors">
                    {soviet.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                    {soviet.shortName}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </header>

              <div className="flex-1">
                <ul className="space-y-1.5" role="list" aria-label="Potential work areas">
                  {soviet.work.slice(0, 4).map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-300 group-hover:text-gray-100 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500/60 flex-shrink-0" aria-hidden="true" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                  {soviet.work.length > 4 && (
                    <li className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0" aria-hidden="true" />
                      <span>+{soviet.work.length - 4} more areas</span>
                    </li>
                  )}
                </ul>
              </div>

              <footer className="mt-4 pt-3 border-t border-gray-800">
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Click to explore
                </span>
              </footer>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}