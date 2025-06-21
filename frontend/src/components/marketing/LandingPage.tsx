'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/ui/Button';
import Image from 'next/image';

export default function LandingPage() {
  const { currentTheme } = useTheme();

  return (
    <div className="relative isolate overflow-hidden bg-theme-primary">
      <svg
        aria-hidden="true"
        className="absolute inset-0 -z-10 size-full mask-[radial-gradient(100%_100%_at_top_right,white,transparent)] stroke-white/10"
      >
        <defs>
          <pattern
            x="50%"
            y={-1}
            id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y={-1} className="overflow-visible fill-theme-neutral/20">
          <path
            d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
            strokeWidth={0}
          />
        </svg>
        <rect fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" width="100%" height="100%" strokeWidth={0} />
      </svg>      <div
        aria-hidden="true"
        className="absolute top-10 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:top-[calc(50%-30rem)] lg:left-48 xl:left-[calc(50%-24rem)]"
      >
        <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-theme-secondary to-theme-accent opacity-20 polygon-clip" />
      </div>
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl shrink-0 lg:mx-0 lg:pt-8">
          <div className="flex items-center gap-3">
            <svg 
              className="h-11 w-11" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="45" fill={currentTheme.colors.secondary} />
              <path 
                d="M30 50L45 65L70 35" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-2xl font-bold text-white">Launch</span>
          </div>
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="rounded-full bg-theme-secondary/10 px-3 py-1 text-sm/6 font-semibold text-theme-secondary ring-1 ring-theme-secondary/20 ring-inset">
                What&apos;s new
              </span>
              <span className="inline-flex items-center space-x-2 text-sm/6 font-medium text-gray-300">
                <span>Just shipped v2.1.0</span>
                <ChevronRight aria-hidden="true" className="size-5 text-gray-500" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
            Propel your fleet operations forward
          </h1>
          <p className="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8">
            Comprehensive transportation management platform designed for trucking companies. 
            Manage drivers, vehicles, loads, and operations with mobile-first design and real-time insights.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Button
              variant="secondary"
              className="rounded-md px-3.5 py-2.5 text-sm font-semibold shadow-xs"
            >
              Get started
            </Button>
            <a href="#features" className="text-sm/6 font-semibold text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 lg:max-w-none lg:flex-none xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">            <div className="relative">
              <Image
                alt="Launch TMS Dashboard Screenshot"
                src="/window.svg"
                width={800}
                height={600}
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-primary/50 to-transparent rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="mx-auto max-w-7xl px-6 pb-24 sm:pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Everything you need to manage your fleet
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            From driver management to load tracking, Launch TMS provides comprehensive tools 
            for modern transportation companies.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Driver Management',
                description: 'Complete driver profiles, licensing, and performance tracking',
                icon: '👨‍💼'
              },
              {
                title: 'Fleet Tracking',
                description: 'Real-time vehicle location and maintenance scheduling',
                icon: '🚛'
              },
              {
                title: 'Load Management',
                description: 'End-to-end load planning, tracking, and delivery confirmation',
                icon: '📦'
              },
              {
                title: 'Analytics & Reports',
                description: 'Comprehensive reporting and business intelligence dashboard',
                icon: '📊'
              }
            ].map((feature, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-theme-secondary/10 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-2xl bg-theme-secondary/10 px-6 py-16 text-center ring-1 ring-theme-secondary/20 sm:px-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready to get started?
          </h2>
          <p className="mt-6 text-lg text-gray-300">
            Join transportation companies already using Launch TMS to streamline their operations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-x-6">
            <Button
              variant="secondary"
              className="rounded-md px-6 py-3 text-base font-semibold shadow-xs"
            >
              Start free trial
            </Button>
            <Button
              variant="outline"
              className="rounded-md px-6 py-3 text-base font-semibold"
            >
              Contact sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
