/**
 * Report Bug Page - User ticket system for bug reports and support requests
 * Professional interface for submitting and tracking support tickets
 */

'use client';

import React, { useState } from 'react';
import ProfessionalLayout from '@/components/layout/ProfessionalLayout';
import ProfessionalPage from '@/components/layout/ProfessionalPage';
import {
  ExclamationTriangleIcon,
  BugAntIcon,
  QuestionMarkCircleIcon,
  LightBulbIcon,
  ShieldExclamationIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PaperClipIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// Sample ticket data for demonstration
const sampleTickets = [
  {
    id: 'TKT-001',
    title: 'Load assignment not updating driver schedule',
    type: 'Bug',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2024-01-15',
    assignedTo: 'Support Team',
    description: 'When assigning a load to a driver, the driver&apos;s schedule view doesn&apos;t update immediately.'
  },
  {
    id: 'TKT-002',
    title: 'Request: Export loads to Excel',
    type: 'Feature Request',
    priority: 'Medium',
    status: 'Under Review',
    createdAt: '2024-01-14',
    assignedTo: 'Product Team',
    description: 'Need ability to export load data to Excel format for external reporting.'
  },
  {
    id: 'TKT-003',
    title: 'GPS tracking intermittent connection',
    type: 'Bug',
    priority: 'Low',
    status: 'Resolved',
    createdAt: '2024-01-12',
    assignedTo: 'Technical Team',
    description: 'GPS tracking occasionally shows "No Signal" even in urban areas.'
  }
];

const ReportBugPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'tickets'>('new');
  const [formData, setFormData] = useState({
    type: 'bug',
    priority: 'medium',
    title: '',
    description: '',
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    browserInfo: '',
    attachments: []
  });

  const ticketTypes = [
    { id: 'bug', label: 'Bug Report', icon: BugAntIcon, color: 'text-error-600' },
    { id: 'feature', label: 'Feature Request', icon: LightBulbIcon, color: 'text-primary-600' },
    { id: 'question', label: 'Question/Help', icon: QuestionMarkCircleIcon, color: 'text-info-600' },
    { id: 'security', label: 'Security Issue', icon: ShieldExclamationIcon, color: 'text-warning-600' }
  ];

  const priorities = [
    { id: 'low', label: 'Low', color: 'bg-success-100 text-success-800' },
    { id: 'medium', label: 'Medium', color: 'bg-warning-100 text-warning-800' },
    { id: 'high', label: 'High', color: 'bg-error-100 text-error-800' },
    { id: 'critical', label: 'Critical', color: 'bg-error-200 text-error-900' }
  ];

  const statusColors = {
    'Open': 'bg-info-100 text-info-800',
    'In Progress': 'bg-warning-100 text-warning-800',
    'Under Review': 'bg-neutral-100 text-neutral-800',
    'Resolved': 'bg-success-100 text-success-800',
    'Closed': 'bg-neutral-200 text-neutral-600'
  };  const kpis = [
    {
      id: 'open-tickets',
      label: 'Open Tickets',
      value: '12',
      change: {
        value: 2,
        type: 'increase' as const,
        period: 'from last week'
      },
      icon: ExclamationTriangleIcon,
      color: 'text-warning-600'
    },
    {
      id: 'response-time',
      label: 'Avg Response Time',
      value: '4.2 hrs',
      change: {
        value: -30,
        type: 'decrease' as const,
        period: 'minutes from last week'
      },
      icon: ClockIcon,
      color: 'text-success-600'
    },
    {
      id: 'resolution-rate',
      label: 'Resolution Rate',
      value: '87%',
      change: {
        value: 5,
        type: 'increase' as const,
        period: 'from last week'
      },
      icon: CheckCircleIcon,
      color: 'text-success-600'
    },
    {
      id: 'my-tickets',
      label: 'My Tickets',
      value: '3',
      change: {
        value: 0,
        type: 'neutral' as const,
        period: 'no change'
      },
      icon: UserIcon,
      color: 'text-neutral-600'
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Submitting ticket:', formData);
    alert('Ticket submitted successfully! You will receive a confirmation email shortly.');
    
    // Reset form
    setFormData({
      type: 'bug',
      priority: 'medium',
      title: '',
      description: '',
      stepsToReproduce: '',
      expectedBehavior: '',
      actualBehavior: '',
      browserInfo: '',
      attachments: []
    });
  };

  return (
    <ProfessionalLayout>      <ProfessionalPage
        title="Report Bug"
        subtitle="Submit bug reports and track support tickets"
        kpis={kpis}
      >
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('new')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-fast',
              activeTab === 'new'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            Submit New Ticket
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-fast',
              activeTab === 'tickets'
                ? 'bg-primary-600 text-white'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            )}
          >
            My Tickets
          </button>
        </div>

        {activeTab === 'new' && (
          <div className="bg-theme-surface rounded-xl border border-neutral-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Ticket Type Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  What type of issue are you reporting?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ticketTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleInputChange('type', type.id)}
                        className={cn(
                          'p-4 border border-neutral-200 rounded-lg text-left transition-all duration-fast hover:border-primary-300',
                          formData.type === type.id && 'border-primary-500 bg-primary-50'
                        )}
                      >
                        <Icon className={cn('h-6 w-6 mb-2', type.color)} />
                        <div className="font-medium text-sm text-neutral-900">{type.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">Priority</label>
                <div className="flex flex-wrap gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() => handleInputChange('priority', priority.id)}
                      className={cn(
                        'px-3 py-1 text-sm font-medium rounded-full border transition-colors duration-fast',
                        formData.priority === priority.id
                          ? priority.color + ' border-current'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      {priority.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Title <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Brief description of the issue"
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description <span className="text-error-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the issue..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Bug-specific fields */}
              {formData.type === 'bug' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Steps to Reproduce
                    </label>
                    <textarea
                      rows={3}
                      value={formData.stepsToReproduce}
                      onChange={(e) => handleInputChange('stepsToReproduce', e.target.value)}
                      placeholder="1. Go to... 2. Click on... 3. See error..."
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Expected Behavior
                      </label>
                      <textarea
                        rows={2}
                        value={formData.expectedBehavior}
                        onChange={(e) => handleInputChange('expectedBehavior', e.target.value)}
                        placeholder="What should happen..."
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Actual Behavior
                      </label>
                      <textarea
                        rows={2}
                        value={formData.actualBehavior}
                        onChange={(e) => handleInputChange('actualBehavior', e.target.value)}
                        placeholder="What actually happens..."
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Browser/Environment Information
                    </label>
                    <input
                      type="text"
                      value={formData.browserInfo}
                      onChange={(e) => handleInputChange('browserInfo', e.target.value)}
                      placeholder="e.g., Chrome 120.0, Windows 11, Mobile Safari..."
                      className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* File Attachment */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center hover:border-neutral-300 transition-colors duration-fast">
                  <PaperClipIcon className="mx-auto h-8 w-8 text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-600">
                    Drop files here or <span className="text-primary-600 font-medium cursor-pointer">browse</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-fast"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {sampleTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-theme-surface rounded-xl border border-neutral-200 p-6 hover:border-neutral-300 transition-colors duration-fast"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-neutral-500">{ticket.id}</span>
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        statusColors[ticket.status as keyof typeof statusColors]
                      )}>
                        {ticket.status}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {ticket.type} • {ticket.priority} Priority
                      </span>
                    </div>
                    <h3 className="font-medium text-neutral-900 mb-2">{ticket.title}</h3>
                    <p className="text-sm text-neutral-600 mb-3">{ticket.description}</p>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {ticket.createdAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <UserIcon className="h-3 w-3" />
                        {ticket.assignedTo}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-fast"
                    title="View ticket details"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {sampleTickets.length === 0 && (
              <div className="text-center py-12">
                <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-neutral-300 mb-3" />
                <h3 className="text-lg font-medium text-neutral-900 mb-1">No tickets found</h3>
                <p className="text-neutral-500">You haven&apos;t submitted any tickets yet.</p>
              </div>
            )}
          </div>
        )}
      </ProfessionalPage>
    </ProfessionalLayout>
  );
};

export default ReportBugPage;
