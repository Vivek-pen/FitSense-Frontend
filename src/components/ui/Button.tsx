import { Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';

export function buttonClass(variant: Variant = 'primary', size: 'md' | 'sm' = 'md') {
  return `btn btn--${variant} btn--${size}`;
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'sm';
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading, disabled, children, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={`${buttonClass(variant, size)} ${className ?? ''}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading && <Loader2 className="spin" size={16} aria-hidden="true" />}
      {children}
    </button>
  );
}
