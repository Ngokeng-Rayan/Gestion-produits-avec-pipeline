import type { ReactNode } from 'react';

export default function ModalWrapper({ children, size }: Readonly<{ children: ReactNode; size?: 'sm' }>) {
  return (
    <div className="modal-overlay">
      <div className={size === 'sm' ? 'modal modal-sm' : 'modal'} role="document">
        {children}
      </div>
    </div>
  );
}
