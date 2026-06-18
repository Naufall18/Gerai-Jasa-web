import * as React from 'react';
import { cn } from '../../lib/utils';

export function Input({
  className,
  type = 'text',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type={type}
      className={cn(
        'w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20',
        className
      )}
      {...props}
    />
  );
}