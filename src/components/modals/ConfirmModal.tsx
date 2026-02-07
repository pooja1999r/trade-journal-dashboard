/**
 * ConfirmModal
 * Confirmation dialog with title, close button, and Confirm/Cancel actions.
 * Variant only affects the confirm button color (default/danger/warning).
 */

import React from 'react';
import { CONFIRM_MODAL_VARIANT, type ConfirmModalVariant } from '../constants/types';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  variant?: ConfirmModalVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const variantConfirmButtonClass: Record<ConfirmModalVariant, string> = {
  default: 'bg-blue-600 text-white hover:bg-blue-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
};

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  variant = CONFIRM_MODAL_VARIANT.DEFAULT,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = variantConfirmButtonClass[variant];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: title + close button */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close"
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-medium ${confirmButtonClass}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
