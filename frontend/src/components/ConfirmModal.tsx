import type { ReactNode } from 'react';
import ModalWrapper from './ModalWrapper';

export default function ConfirmModal({ title, children, confirmLabel = 'Supprimer', onConfirm, onCancel }: Readonly<{
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}>) {
  return (
    <ModalWrapper size="sm">
      <h2>{title}</h2>
      {children}
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={onCancel}>Annuler</button>
        <button className="btn btn-danger" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </ModalWrapper>
  );
}
