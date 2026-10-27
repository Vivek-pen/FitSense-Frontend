import type { CSSProperties } from 'react';

export function Skeleton({ height = 16, width = '100%', style }: { height?: number; width?: number | string; style?: CSSProperties }) {
  return <div className="skeleton" aria-hidden="true" style={{ height, width, ...style }} />;
}

/** A column of placeholder rows that matches the size of the real activity rows to avoid layout jumps. */
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="stack" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={76} style={{ borderRadius: 16 }} />
      ))}
    </div>
  );
}
