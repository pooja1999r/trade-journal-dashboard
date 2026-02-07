/**
 * SelectBox – Standard single/multi select dropdown.
 * Used in TradeFilters, CreateTradeModal, and elsewhere.
 */

import React, { useRef, useEffect, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectBoxMode = 'single' | 'multi';

export interface SelectBoxBaseProps {
  options: SelectOption[] | string[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  className?: string;
  minWidth?: string;
  dropdownMinWidth?: string;
  id?: string;
}

export interface SelectBoxSingleProps extends SelectBoxBaseProps {
  mode: 'single';
  value: string | null;
  onChange: (value: string | null) => void;
  allowClear?: boolean;
  clearLabel?: string;
}

export interface SelectBoxMultiProps extends SelectBoxBaseProps {
  mode: 'multi';
  value: string[];
  onChange: (value: string[]) => void;
  selectAllLabel?: string;
}

export type SelectBoxProps = SelectBoxSingleProps | SelectBoxMultiProps;

function normalizeOptions(options: SelectOption[] | string[]): SelectOption[] {
  if (options.length === 0) return [];
  const first = options[0];
  if (typeof first === 'string') {
    return (options as string[]).map((s) => ({ value: s, label: s }));
  }
  return options as SelectOption[];
}

export const SelectBox: React.FC<SelectBoxProps> = (props) => {
  const {
    options: rawOptions,
    label,
    placeholder = 'Select...',
    disabled = false,
    loading = false,
    error,
    className = '',
    minWidth = '140px',
    dropdownMinWidth,
    id,
  } = props;

  const options = normalizeOptions(rawOptions);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isSingle = props.mode === 'single';
  const value = props.value;
  const selectedSet = isSingle
    ? new Set(value != null ? [value] : [])
    : new Set((value as string[]) || []);

  const displayLabel = (() => {
    if (loading) return 'Loading...';
    if (isSingle) {
      const v = value as string | null;
      if (v == null || v === '') return placeholder;
      const opt = options.find((o) => o.value === v);
      return opt ? opt.label : v;
    }
    const arr = value as string[];
    if (arr.length === 0) return placeholder;
    if (arr.length === 1) return options.find((o) => o.value === arr[0])?.label ?? arr[0];
    return `${arr.length} selected`;
  })();

  const isOpen = open && !disabled;

  return (
    <div ref={ref} className={`relative ${className}`} style={{ minWidth }}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      {/* Trigger – standard select-style */}
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between rounded-md border bg-white text-left text-sm text-gray-900 shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-60 ${
          isOpen
            ? 'border-blue-500 ring-2 ring-blue-500/30'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        style={{ minWidth, padding: '0.375rem 0.75rem' }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="truncate">{displayLabel}</span>
        <svg
          className={`ml-2 h-4 w-4 flex-shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="listbox"
          className="dropdown-panel-scroll absolute left-0 right-0 top-full z-50 mt-1 max-h-60 min-w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          style={dropdownMinWidth ? { minWidth: dropdownMinWidth } : undefined}
        >
          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          )}
          {error && !loading && (
            <div className="px-3 py-2 text-sm text-red-600">{error}</div>
          )}
          {!loading && !error && (
            <>
              {isSingle && props.allowClear && (
                <button
                  type="button"
                  role="option"
                  aria-selected={value == null || value === ''}
                  onClick={() => {
                    (props as SelectBoxSingleProps).onChange(null);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    value == null || value === ''
                      ? 'bg-blue-50 font-medium text-blue-700'
                      : 'text-gray-900'
                  }`}
                >
                  {props.clearLabel ?? 'All'}
                </button>
              )}

              {props.mode === 'multi' && props.selectAllLabel != null && (
                <button
                  type="button"
                  role="option"
                  aria-selected={(value as string[]).length === 0}
                  onClick={() => {
                    (props as SelectBoxMultiProps).onChange([]);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    (value as string[]).length === 0
                      ? 'bg-blue-50 font-medium text-blue-700'
                      : 'text-gray-900'
                  }`}
                >
                  {props.selectAllLabel}
                </button>
              )}

              {options.length > 0 && props.mode === 'multi' && props.selectAllLabel != null && (
                <div className="my-1 border-t border-gray-100" />
              )}

              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options found
                </div>
              )}

              {options.map((opt) => {
                const selected = selectedSet.has(opt.value);
                if (isSingle) {
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        (props as SelectBoxSingleProps).onChange(opt.value);
                        setOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                        selected
                          ? 'bg-blue-50 font-medium text-blue-700'
                          : 'text-gray-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                }
                const multiProps = props as SelectBoxMultiProps;
                return (
                  <label
                    key={opt.value}
                    role="option"
                    aria-selected={selected}
                    className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                      selected
                        ? 'bg-blue-50 font-medium text-blue-700'
                        : 'text-gray-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => {
                        const next = selected
                          ? multiProps.value.filter((v) => v !== opt.value)
                          : [...multiProps.value, opt.value];
                        multiProps.onChange(next);
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </>
          )}
        </div>
      )}
    </div>
  );
};
