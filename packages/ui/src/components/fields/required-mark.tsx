import type { ReactNode } from 'react';

export function requiredMark(label: ReactNode, { required }: { required: boolean }) {
  return (
    <>
      {label}
      {required && (
        <span className="erp-req" aria-hidden="true">
          *
        </span>
      )}
    </>
  );
}
