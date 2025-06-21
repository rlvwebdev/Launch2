import React, { Fragment, forwardRef } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'elevated' | 'centered' | 'fullscreen';
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'split' | 'center';
}

// Professional modal variants
const modalVariants = cva(
  "relative transform overflow-hidden bg-white text-left shadow-2xl transition-all",
  {
    variants: {
      variant: {
        default: "rounded-xl",
        elevated: "rounded-xl shadow-elevation-high",
        centered: "rounded-xl mx-auto",
        fullscreen: "h-full w-full max-w-none rounded-none",
      },
      size: {
        sm: "max-w-md",
        md: "max-w-lg", 
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        full: "max-w-7xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Overlay variants
const overlayVariants = cva(
  "fixed inset-0 transition-opacity",
  {
    variants: {
      variant: {
        default: "bg-neutral-900/50 backdrop-blur-sm",
        elevated: "bg-neutral-900/60 backdrop-blur-md",
        centered: "bg-neutral-900/50 backdrop-blur-sm", 
        fullscreen: "bg-neutral-900/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  variant = 'default',
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  className,
}: ModalProps) {
  const handleOverlayClick = closeOnOverlayClick ? onClose : undefined;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleOverlayClick || (() => {})}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className={overlayVariants({ variant })} />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className={cn(
            "flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0",
            variant === "fullscreen" && "p-0"
          )}>
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                className={cn(
                  modalVariants({ variant, size }),
                  "px-4 pb-4 pt-5 sm:my-8 sm:w-full sm:p-6",
                  variant === "fullscreen" && "sm:my-0 sm:p-8",
                  className
                )}
              >
                {showCloseButton && (
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className={cn(
                        "rounded-md bg-white text-neutral-400 hover:text-neutral-500",
                        "focus:outline-none focus:ring-2 focus:ring-launch-500 focus:ring-offset-2",
                        "transition-colors"
                      )}
                      onClick={onClose}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                )}

                {(title || description) && (
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      {title && (
                        <DialogTitle as="h3" className="text-lg font-semibold leading-6 text-neutral-900">                          {title}
                        </DialogTitle>
                      )}
                      {description && (
                        <div className="mt-2">
                          <p className="text-sm text-neutral-500">{description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className={cn('mt-5 sm:mt-4', title || description ? 'mt-6' : '')}>
                  {children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'mb-4 border-b border-neutral-200 pb-4',
        'text-neutral-900 font-semibold',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
);

export const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(
        'py-4',
        'text-neutral-700 leading-relaxed',
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
);

// Professional footer variants
const footerVariants = cva(
  "mt-6 flex gap-3",
  {
    variants: {
      variant: {
        default: "flex-col-reverse sm:flex-row sm:justify-end",
        split: "justify-between items-center",
        center: "justify-center",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(footerVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  )
);

ModalHeader.displayName = 'ModalHeader';
ModalBody.displayName = 'ModalBody';
ModalFooter.displayName = 'ModalFooter';
