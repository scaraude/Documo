import type * as React from 'react';

import { cn } from '@/lib/utils';

interface CheckboxProps
  extends Omit<React.ComponentProps<'input'>, 'type' | 'onChange'> {
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-sm border border-primary shadow-xs',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'checked:bg-primary checked:text-primary-foreground',
        'accent-primary cursor-pointer',
        className,
      )}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      {...props}
    />
  );
}

export { Checkbox };
