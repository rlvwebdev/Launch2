import * as React from "react"
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from "@/lib/utils"

// Professional table variants
const tableVariants = cva(
  "w-full caption-bottom text-sm border-collapse",
  {
    variants: {
      variant: {
        default: "border-separate border-spacing-0",
        bordered: "border border-neutral-200 rounded-lg overflow-hidden",
        striped: "border-separate border-spacing-0",
        minimal: "border-separate border-spacing-0",
      },
      size: {
        sm: "text-xs",
        md: "text-sm", 
        lg: "text-base",
      },
      density: {
        compact: "[&_td]:py-2 [&_th]:py-2",
        normal: "[&_td]:py-3 [&_th]:py-3",
        comfortable: "[&_td]:py-4 [&_th]:py-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      density: "normal",
    },
  }
)

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & VariantProps<typeof tableVariants>
>(({ className, variant, size, density, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(tableVariants({ variant, size, density }), className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "bg-neutral-50/80 backdrop-blur-sm sticky top-0 z-10",
      "border-b border-neutral-200",
      className
    )} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "divide-y divide-neutral-100",
      "[&_tr:last-child]:border-0",
      className
    )}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-neutral-200 bg-neutral-50/50 font-medium",
      "[&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-neutral-100 transition-colors",
      "hover:bg-neutral-50/50 data-[state=selected]:bg-launch-50",
      "focus-within:bg-neutral-50/80",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "px-4 py-3 text-left align-middle font-semibold text-neutral-700",
      "text-xs uppercase tracking-wide",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "first:pl-6 last:pr-6",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-neutral-900",
      "[&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      "first:pl-6 last:pr-6",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn(
      "mt-4 text-sm text-neutral-500 caption-bottom",
      className
    )}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// Additional professional table components
const TableToolbar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-4 mb-4",
      "p-4 bg-white border border-neutral-200 rounded-lg",
      className
    )}
    {...props}
  />
))
TableToolbar.displayName = "TableToolbar"

const TablePagination = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-4 mt-4",
      "p-4 bg-neutral-50/50 border-t border-neutral-200 rounded-b-lg",
      className
    )}
    {...props}
  />
))
TablePagination.displayName = "TablePagination"

const TableEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col items-center justify-center py-12 text-center",
      "text-neutral-500",
      className
    )}
    {...props}
  >
    {children || (
      <>
        <div className="text-sm font-medium">No data available</div>
        <div className="text-xs mt-1">There are no items to display</div>
      </>
    )}
  </div>
))
TableEmpty.displayName = "TableEmpty"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableToolbar,
  TablePagination,
  TableEmpty,
}
