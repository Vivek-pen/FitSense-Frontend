import { forwardRef, useId, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
}

function FieldShell({ id, label, error, hint, children }: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="field__hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field__error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

function describe(id: string, error?: string, hint?: string) {
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? `${id}-error` : hint ? `${id}-hint` : undefined };
}

export const Input = forwardRef<HTMLInputElement, FieldProps & InputHTMLAttributes<HTMLInputElement>>(
  ({ label, error, hint, ...rest }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <input ref={ref} id={id} className="input" {...describe(id, error, hint)} {...rest} />
      </FieldShell>
    );
  },
);
Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, FieldProps & SelectHTMLAttributes<HTMLSelectElement>>(
  ({ label, error, hint, children, ...rest }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <select ref={ref} id={id} className="input" {...describe(id, error, hint)} {...rest}>{children}</select>
      </FieldShell>
    );
  },
);
Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ label, error, hint, ...rest }, ref) => {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} hint={hint}>
        <textarea ref={ref} id={id} className="input" {...describe(id, error, hint)} {...rest} />
      </FieldShell>
    );
  },
);
Textarea.displayName = 'Textarea';
