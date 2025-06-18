'use client';

'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import LSWDailyReportPage from '@/components/reports/LSWDailyReportPage';

function EditLSWReportContent() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');

  return <LSWDailyReportPage reportId={reportId || undefined} />;
}

export default function EditLSWReportRoute() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <EditLSWReportContent />
    </Suspense>
  );
}
