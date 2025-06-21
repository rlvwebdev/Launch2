import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
}

interface FormGroupProps extends VariantProps<typeof formGroupVariants> {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  optional?: boolean;
}

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

interface FormHelperTextProps {
  children: React.ReactNode;
  className?: string;
}

interface FormFieldsetProps {
  children: React.ReactNode;
  className?: string;
  legend?: string;
}

// Professional form group variants
const formGroupVariants = cva(
  "space-y-2",
  {
    variants: {
      spacing: {
        sm: "space-y-1",
        md: "space-y-2",
        lg: "space-y-3",
      },
    },
    defaultVariants: {
      spacing: "md",
    },
  }
)

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ children, className, ...props }, ref) => (
    <form ref={ref} className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  )
);

export const FormGroup = forwardRef<HTMLDivElement, FormGroupProps>(
  ({ children, className, spacing, ...props }, ref) => (
    <div ref={ref} className={cn(formGroupVariants({ spacing }), className)} {...props}>
      {children}
    </div>
  )
);

export const FormFieldset = forwardRef<HTMLFieldSetElement, FormFieldsetProps>(
  ({ children, className, legend, ...props }, ref) => (
    <fieldset
      ref={ref}
      className={cn(
        'border border-neutral-200 rounded-lg p-4',
        'space-y-4',
        className
      )}
      {...props}
    >
      {legend && (
        <legend className="px-2 text-sm font-semibold text-neutral-700">
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  )
);

export const FormLabel = forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ children, className, required, optional, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium leading-6 text-neutral-900',
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-1">
        {children}
        {required && (
          <span className="text-status-error" aria-label="required">
            *
          </span>
        )}
        {optional && (
          <span className="text-neutral-500 font-normal" aria-label="optional">
            (optional)
          </span>
        )}
      </span>
    </label>
  )
);

export const FormError = forwardRef<HTMLParagraphElement, FormErrorProps>(
  ({ children, className, showIcon = true, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        'text-sm text-status-error flex items-start gap-2 mt-1',
        className
      )}
      role="alert"
      {...props}
    >
      {showIcon && (
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      )}
      <span>{children}</span>
    </p>
  )
);

export const FormHelperText = forwardRef<HTMLParagraphElement, FormHelperTextProps>(
  ({ children, className, ...props }, ref) => (
    <p 
      ref={ref} 
      className={cn(
        'text-sm text-neutral-600 leading-relaxed',
        className
      )} 
      {...props}
    >
      {children}
    </p>
  )
);

Form.displayName = 'Form';
FormGroup.displayName = 'FormGroup';
FormFieldset.displayName = 'FormFieldset';
FormLabel.displayName = 'FormLabel';
FormError.displayName = 'FormError';
FormHelperText.displayName = 'FormHelperText';
