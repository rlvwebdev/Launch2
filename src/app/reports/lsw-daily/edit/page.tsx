'use client';

import { useSearchParams } from 'next/navigation';
import LSWDailyReportPage from '@/components/reports/LSWDailyReportPage';

export default function EditLSWReportRoute() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');

  return <LSWDailyReportPage reportId={reportId || undefined} />;
}
