'use client';

import React from 'react';
import ProfessionalPage from '@/components/layout/ProfessionalPage';
import { 
  AcademicCapIcon,
  PlayIcon,
  BookOpenIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

export default function AcademyPage() {
  const kpis = [
    {
      id: 'total-courses',
      label: 'Total Courses',
      value: 24,
      icon: BookOpenIcon,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'completed',
      label: 'Completed',
      value: 18,
      icon: CheckCircleIcon,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: 3,
      icon: ClockIcon,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      id: 'active-users',
      label: 'Active Users',
      value: 147,
      icon: UserGroupIcon,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: 'TMS Fundamentals',
      description: 'Learn the basics of Transportation Management Systems',
      duration: '2 hours',
      lessons: 12,
      difficulty: 'Beginner',
      progress: 100,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 2,
      title: 'Fleet Management Best Practices',
      description: 'Advanced strategies for managing truck fleets effectively',
      duration: '3.5 hours',
      lessons: 18,
      difficulty: 'Intermediate',
      progress: 65,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 3,
      title: 'Load Planning & Optimization',
      description: 'Optimize routes and maximize efficiency in load management',
      duration: '2.5 hours',
      lessons: 15,
      difficulty: 'Advanced',
      progress: 0,
      thumbnail: '/api/placeholder/300/200'
    },
    {
      id: 4,
      title: 'Driver Safety & Compliance',
      description: 'Ensure safety standards and regulatory compliance',
      duration: '1.5 hours',
      lessons: 8,
      difficulty: 'Beginner',
      progress: 25,
      thumbnail: '/api/placeholder/300/200'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <ProfessionalPage
      title="Launch Academy"
      subtitle="TMS Training & Tutorials for Transportation Professionals"
      kpis={kpis}
      showKPIs={true}
      breadcrumbs={[
        { label: 'More Apps', href: '#' },
        { label: 'Academy' }
      ]}
    >
      <div className="space-y-8">
        {/* Continue Learning Section */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Continue Learning</h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <PlayIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                  Fleet Management Best Practices
                </h3>                <p className="text-neutral-600 mb-4">
                  You&apos;re 65% through this course. Continue where you left off.
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-neutral-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[65%]"></div>
                  </div>
                  <span className="text-sm text-neutral-600">65% complete</span>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Continue Course
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Courses */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Featured Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-all">
                <div className="h-48 bg-neutral-100 flex items-center justify-center">
                  <AcademicCapIcon className="h-16 w-16 text-neutral-400" />
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                    <span className="text-xs text-neutral-500">{course.lessons} lessons</span>
                  </div>
                  
                  <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
                    <span>Duration: {course.duration}</span>
                    {course.progress > 0 && (
                      <span>{course.progress}% complete</span>
                    )}
                  </div>
                    {course.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex-1 bg-neutral-200 rounded-full h-1">
                        <div 
                          className={`bg-blue-600 h-1 rounded-full w-[${course.progress}%]`}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                    {course.progress > 0 ? 'Continue' : 'Start Course'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Paths */}
        <div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Learning Paths</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Fleet Manager Certification</h3>
              <p className="text-neutral-600 mb-4">
                Complete path to become a certified fleet management professional
              </p>
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                <span>8 courses</span>
                <span>•</span>
                <span>~20 hours</span>
                <span>•</span>
                <span>Certificate included</span>
              </div>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                View Path →
              </button>
            </div>
            
            <div className="bg-white rounded-lg border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">TMS Operations Specialist</h3>
              <p className="text-neutral-600 mb-4">
                Master TMS operations from basic concepts to advanced strategies
              </p>
              <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
                <span>12 courses</span>
                <span>•</span>
                <span>~30 hours</span>
                <span>•</span>
                <span>Certificate included</span>
              </div>
              <button className="text-primary-600 font-medium hover:text-primary-700 transition-colors">
                View Path →
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProfessionalPage>
  );
}
