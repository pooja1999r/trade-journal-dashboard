/**
 * LocalStorage Persistence Utilities
 * 
 * Handles loading and saving trades to browser localStorage.
 * Provides a clean abstraction layer for persistence logic.
 */

import { Trade } from '../store/types';

const STORAGE_KEY = 'trade-journal-data';

/**
 * Save trades array to localStorage
 */
export const saveToLocalStorage = (trades: Trade[]): void => {
  try {
    const serialized = JSON.stringify(trades);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

/**
 * Load trades array from localStorage
 * Returns empty array if no data exists or if parsing fails
 */
export const loadFromLocalStorage = (): Trade[] => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized === null) {
      return [];
    }
    return JSON.parse(serialized) as Trade[];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
};

/**
 * Clear all trades from localStorage
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
  }
};
