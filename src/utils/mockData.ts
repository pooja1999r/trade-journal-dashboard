/**
 * Mock Data for Development and Testing
 * 
 * Provides sample trades for demonstration purposes.
 */

import { Trade } from '../store/types';

export const mockTrades: Trade[] = [
  {
    id: '1',
    symbol: 'AAPL',
    direction: 'LONG',
    status: 'CLOSED',
    buyLegs: [
      {
        id: 'b1',
        price: 150.25,
        quantity: 100,
        timestamp: '2024-01-15T10:30:00Z',
      },
      {
        id: 'b2',
        price: 149.80,
        quantity: 50,
        timestamp: '2024-01-15T14:15:00Z',
      },
    ],
    sellLegs: [
      {
        id: 's1',
        price: 155.50,
        quantity: 150,
        timestamp: '2024-01-20T11:00:00Z',
      },
    ],
    createdAt: '2024-01-15T10:30:00Z',
    notes: 'Strong bullish momentum after earnings beat. Closed position on resistance.',
  },
  {
    id: '2',
    symbol: 'BTCUSDT',
    direction: 'SHORT',
    status: 'OPEN',
    buyLegs: [],
    sellLegs: [
      {
        id: 's1',
        price: 45000,
        quantity: 0.5,
        timestamp: '2024-02-01T09:00:00Z',
      },
    ],
    createdAt: '2024-02-01T09:00:00Z',
    notes: 'Shorting at resistance level, watching for breakdown.',
  },
  {
    id: '3',
    symbol: 'NIFTY',
    direction: 'LONG',
    status: 'OPEN',
    buyLegs: [
      {
        id: 'b1',
        price: 21500,
        quantity: 75,
        timestamp: '2024-02-03T09:15:00Z',
      },
    ],
    sellLegs: [],
    createdAt: '2024-02-03T09:15:00Z',
    notes: 'Index showing strength, targeting 22000.',
  },
  {
    id: '4',
    symbol: 'TSLA',
    direction: 'LONG',
    status: 'CLOSED',
    buyLegs: [
      {
        id: 'b1',
        price: 180.50,
        quantity: 50,
        timestamp: '2024-01-10T10:00:00Z',
      },
      {
        id: 'b2',
        price: 178.25,
        quantity: 30,
        timestamp: '2024-01-10T15:30:00Z',
      },
    ],
    sellLegs: [
      {
        id: 's1',
        price: 185.75,
        quantity: 40,
        timestamp: '2024-01-12T10:30:00Z',
      },
      {
        id: 's2',
        price: 187.20,
        quantity: 40,
        timestamp: '2024-01-12T14:00:00Z',
      },
    ],
    createdAt: '2024-01-10T10:00:00Z',
    notes: 'Swing trade on technical breakout. Took profits in two tranches.',
  },
];
