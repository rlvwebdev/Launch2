'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import BadgeLegacy from '@/components/ui/BadgeLegacy';

const Badge = BadgeLegacy;
import { 
  Calendar, 
  FileText, 
  Edit3, 
  Download, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Search,
  Filter
} from 'lucide-react';
import { DailyStatusReport, ReportStatus } from '@/types';

interface LSWReportHistoryProps {
  terminalId?: string;
}

export default function LSWReportHistory({ terminalId = 'terminal-1' }: LSWReportHistoryProps) {
  const [reports, setReports] = useState<DailyStatusReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');

  // Generate sample report history
  useEffect(() => {
    const generateSampleReports = () => {
      const sampleReports: DailyStatusReport[] = [];
      const today = new Date();
      
      // Generate reports for the last 30 days
      for (let i = 0; i < 30; i++) {
        const reportDate = new Date(today);
        reportDate.setDate(reportDate.getDate() - i);
        
        // Skip weekends for sample data
        if (reportDate.getDay() === 0 || reportDate.getDay() === 6) continue;
        
        const isLate = Math.random() > 0.9; // 10% chance of late submission
        const isNotSubmitted = i === 0 && Math.random() > 0.7; // 30% chance today's report is not submitted
        
        let status: ReportStatus;
        if (isNotSubmitted) {
          status = ReportStatus.DRAFT;
        } else if (isLate) {
          status = ReportStatus.SUBMITTED;
        } else {
          status = ReportStatus.APPROVED;
        }

        sampleReports.push({
          id: `report-${reportDate.toISOString().split('T')[0]}`,
          reportDate,
          terminalId,
          submittedBy: 'John Doe',
          submittedAt: new Date(reportDate.getTime() + (isLate ? 11 * 60 * 60 * 1000 : 9 * 60 * 60 * 1000)), // 9 AM or 11 AM
          status,
          reportData: {} as any, // Simplified for history view
          notifications: [],
          isLateSubmission: isLate,
          approvalRequired: false,
          lastEditedAt: isNotSubmitted ? new Date() : undefined
        });
      }
      
      setReports(sampleReports);
    };

    generateSampleReports();
  }, [terminalId]);

  const filteredReports = reports.filter(report => {
    const matchesDate = report.reportDate.getMonth() === selectedMonth && 
                       report.reportDate.getFullYear() === selectedYear;
    const matchesSearch = searchTerm === '' || 
                         report.submittedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ReportStatus, isLate: boolean) => {
    switch (status) {
      case ReportStatus.APPROVED:
        return <CheckCircle className={`h-4 w-4 ${isLate ? 'text-orange-600' : 'text-green-600'}`} />;
      case ReportStatus.SUBMITTED:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case ReportStatus.DRAFT:
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: ReportStatus, isLate: boolean) => {
    if (status === ReportStatus.APPROVED && isLate) {
      return <Badge variant="status" status="maintenance">LATE APPROVED</Badge>;
    }
    
    switch (status) {
      case ReportStatus.APPROVED:
        return <Badge variant="status" status="delivered">APPROVED</Badge>;
      case ReportStatus.SUBMITTED:
        return <Badge variant="status" status="pending">SUBMITTED</Badge>;
      case ReportStatus.DRAFT:
        return <Badge variant="status" status="oos">NOT SUBMITTED</Badge>;
      case ReportStatus.UNDER_REVIEW:
        return <Badge variant="status" status="in-transit">UNDER REVIEW</Badge>;
      default:
        return <Badge variant="default">{status.toUpperCase()}</Badge>;
    }
  };

  const handleViewReport = (reportId: string) => {
    window.open(`/reports/lsw-daily/edit?id=${reportId}`, '_blank');
  };

  const handleEditReport = (reportId: string) => {
    window.location.href = `/reports/lsw-daily/edit?id=${reportId}`;
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">LSW Report History</h2>
          <p className="text-gray-600 mt-1">View and manage previous daily status reports</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Month/Year Selectors */}
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value={ReportStatus.DRAFT}>Not Submitted</option>
            <option value={ReportStatus.SUBMITTED}>Submitted</option>
            <option value={ReportStatus.APPROVED}>Approved</option>
            <option value={ReportStatus.UNDER_REVIEW}>Under Review</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by submitted by..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-900">Approved</span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {filteredReports.filter(r => r.status === ReportStatus.APPROVED).length}
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900">Submitted</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {filteredReports.filter(r => r.status === ReportStatus.SUBMITTED).length}
          </p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-900">Not Submitted</span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {filteredReports.filter(r => r.status === ReportStatus.DRAFT).length}
          </p>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span className="font-semibold text-orange-900">Late Submissions</span>
          </div>
          <p className="text-2xl font-bold text-orange-900 mt-1">
            {filteredReports.filter(r => r.isLateSubmission).length}
          </p>
        </div>
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">
            Reports for {months[selectedMonth]} {selectedYear}
          </h3>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No reports found for the selected filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(report.status, report.isLateSubmission)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {report.reportDate.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                        {getStatusBadge(report.status, report.isLateSubmission)}
                      </div>
                      <p className="text-sm text-gray-600">
                        Submitted by: {report.submittedBy}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.status !== ReportStatus.DRAFT ? (
                          <>Submitted: {report.submittedAt.toLocaleString()}</>
                        ) : (
                          <>Last edited: {report.lastEditedAt?.toLocaleString() || 'Never'}</>
                        )}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReport(report.id)}
                      className="flex items-center gap-1"
                    >
                      <FileText className="h-3 w-3" />
                      View
                    </Button>
                    
                    {report.status === ReportStatus.DRAFT && (
                      <Button
                        size="sm"
                        onClick={() => handleEditReport(report.id)}
                        className="flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement report download
                        console.log('Download report:', report.id);
                      }}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Export
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
