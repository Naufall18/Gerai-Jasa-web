import * as React from 'react';
import { cn } from '../../lib/utils';

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'gj-card border border-slate-200/80 bg-white p-6 shadow-sm',
        className
      )}
      {...props}
    />
  );
}