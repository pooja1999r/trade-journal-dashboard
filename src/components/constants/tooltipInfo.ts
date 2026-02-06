/**
 * Tooltip content constants for components
 */

import type { TooltipInfoItem } from './types';

export const tooltipInfo: Record<string, TooltipInfoItem> = {
  Symbol: {
    title: 'Symbol',
    description:
      'The trading pair or asset symbol (e.g., BTC, ETH) used to identify the instrument.',
    icon: 'info',
  },
  Status: {
    title: 'Status',
    description:
      'OPEN = position still held. CLOSED = position has been exited.',
    icon: 'info',
  },
  Position: {
    title: 'Position',
    description: 'LONG = bought to open. SHORT = sold to open.',
    icon: 'info',
  },
};
