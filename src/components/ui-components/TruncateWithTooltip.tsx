/**
 * TruncateWithTooltip
 * Renders text with truncation (ellipsis). Shows the full text in a tooltip on hover
 * only when the text is actually truncated (overflow).
 * Tooltip is rendered in a portal so it appears above the table header.
 */

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface TruncateWithTooltipProps {
  /** Text to show. When truncated, full text appears in tooltip on hover. */
  text: string;
  /** Optional placeholder when text is empty */
  placeholder?: string;
  /** Extra class for the truncate span container */
  className?: string;
  /** Max width for the text (e.g. '10rem'). Enforces truncation. */
  maxWidth?: string;
  /** Tooltip position relative to the text */
  placement?: 'top' | 'bottom';
  /** Optional class for the tooltip popover */
  tooltipClassName?: string;
  /** Called when tooltip visibility changes (e.g. for parent to adjust z-index) */
  onTooltipChange?: (visible: boolean) => void;
}

export const TruncateWithTooltip: React.FC<TruncateWithTooltipProps> = ({
  text,
  placeholder = '—',
  className = '',
  maxWidth,
  placement = 'top',
  tooltipClassName = '',
  onTooltipChange,
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const showTooltip = isHovered && isTruncated && text?.trim();

  useEffect(() => {
    onTooltipChange?.(!!showTooltip);
    return () => onTooltipChange?.(false);
  }, [showTooltip, onTooltipChange]);

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !text) {
      setIsTruncated(false);
      return;
    }
    const check = () => {
      setIsTruncated(el.scrollWidth > el.clientWidth);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);

  const updateAnchorRect = () => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    setAnchorRect(wrapper.getBoundingClientRect());
  };

  useEffect(() => {
    if (!showTooltip) {
      setAnchorRect(null);
      return;
    }
    updateAnchorRect();
    window.addEventListener('scroll', updateAnchorRect, true);
    window.addEventListener('resize', updateAnchorRect);
    return () => {
      window.removeEventListener('scroll', updateAnchorRect, true);
      window.removeEventListener('resize', updateAnchorRect);
    };
  }, [showTooltip]);

  const displayText = text?.trim() || placeholder;

  const tooltipPortal =
    showTooltip &&
    anchorRect &&
    typeof document !== 'undefined' &&
    createPortal(
      <div
        className={`fixed z-[9999] max-h-48 max-w-sm overflow-y-auto rounded-lg bg-gray-800 px-3 py-2.5 text-sm font-normal leading-relaxed text-white shadow-lg whitespace-pre-wrap break-words ${tooltipClassName}`}
        style={{
          left: Math.max(8, Math.min(anchorRect.left, window.innerWidth - 12 * 16 - 8)),
          minWidth: '12rem',
          ...(placement === 'top'
            ? { bottom: `${window.innerHeight - anchorRect.top + 8}px` }
            : { top: `${anchorRect.bottom + 8}px` }),
        }}
      >
        {text}
      </div>,
      document.body
    );

  return (
    <>
      <span
        ref={wrapperRef}
        className={`relative block min-w-0 overflow-visible ${className}`}
        style={maxWidth ? { maxWidth } : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span ref={spanRef} className="block min-w-0 truncate overflow-hidden">
          {displayText}
        </span>
      </span>
      {tooltipPortal}
    </>
  );
};
