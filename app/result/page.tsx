import { Suspense } from 'react';
import ResultClient from './ResultClient';

export const dynamic = 'force-dynamic';

function ResultLoading() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col" id="main-content" tabIndex={-1}>
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

export default function ResultPage() {
  return (
    <Suspense fallback={<ResultLoading />}>
      <ResultClient />
    </Suspense>
  );
}
