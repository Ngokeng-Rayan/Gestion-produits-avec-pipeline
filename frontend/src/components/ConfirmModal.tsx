import type { ReactNode } from 'react';

export default function ConfirmModal({ title, children, confirmLabel = 'Supprimer', onConfirm, onCancel }: Readonly<{
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}>) {
  return (
    <div className="modal-overlay">
      <div className="modal modal-sm" role="document">
        <h2>{title}</h2>
        {children}
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
          <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
