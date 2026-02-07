/**
 * Filter dropdown options for TradeFilters and other components.
 * Used with SelectBox and similar components that expect { value, label }.
 */

export interface FilterOption {
  value: string;
  label: string;
}

/** Position filter: LONG, SHORT */
export const POSITION_OPTIONS: FilterOption[] = [
  { value: 'LONG', label: 'LONG' },
  { value: 'SHORT', label: 'SHORT' },
];

/** Status filter: Open, Closed */
export const STATUS_OPTIONS: FilterOption[] = [
  { value: 'OPEN', label: 'Open' },
  { value: 'CLOSED', label: 'Closed' },
];

/** Entry type filter: Buy, Sell */
export const ENTRY_TYPE_OPTIONS: FilterOption[] = [
  { value: 'BUY', label: 'Buy' },
  { value: 'SELL', label: 'Sell' },
];
