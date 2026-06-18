import * as React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'outline';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const colors =
    variant === 'success'
      ? 'bg-emerald-50 text-emerald-700'
      : variant === 'warning'
      ? 'bg-amber-50 text-amber-700'
      : variant === 'danger'
      ? 'bg-red-50 text-red-700'
      : variant === 'outline'
      ? 'border border-slate-200 bg-white text-slate-700'
      : 'bg-slate-100 text-slate-800';

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
        colors,
        className
      )}
      {...props}
    />
  );
}