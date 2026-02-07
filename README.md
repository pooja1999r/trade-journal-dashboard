# Trade Journal

A production-quality React application for tracking crypto trades with **live Binance WebSocket** market data.

## 📋 Overview

Trade Journal is a frontend application for traders to record, visualize, and manage trading positions. It subscribes to **Binance ticker streams** for symbols from your trades and shows live prices and daily % change in the table. Trades support LONG/SHORT positions with open/close prices, PNL, R-multiple, stop loss, notes, and tags.

The application emphasizes:
- **Clean state modeling** with TypeScript types and localStorage
- **Real-time market data** via Binance WebSocket (no API key required)
- **Clear UI** with trade table, filters, and detail modal
- **Scalable structure** with services, hooks, and components

## ✨ Features

### Core Features
- **Trade Management**
  - Create trades with symbol, position (LONG/SHORT), open/close timestamps and prices
  - Stop loss, R-value, notes, tags
  - Edit notes and tags in the detail modal

- **Trade Table**
  - Symbol, Status, Position, Open/Close Time, Duration
  - Open/Close Price, PNL (green/red), R-Value, Stop Loss
  - Tags, Notes
  - **Current Price** and **Daily % Change** from Binance (live)
  - Sorted by open time (latest first)

- **Derived Fields**
  - PNL: LONG → (closePrice − openPrice) × quantity; SHORT → (openPrice − closePrice) × quantity
  - Human-readable duration (e.g. 2h 15m)
  - R-Multiple: PNL ÷ risk per trade

- **Market Data**
  - **Binance WebSocket** ticker streams for symbols in your trades
  - No API key needed (public streams)
  - Live updates; table re-renders on new data
  - Single connection, batched streams

- **Filters & Search**
  - Filter by symbol, position (LONG/SHORT), status, tags
  - Search by notes text
  - Filters persisted in localStorage

- **Modals**
  - **Trade Detail**: Row click opens modal with trade summary and chart (Recharts)
  - **Create Trade**: Form for new trade
  - **Confirm**: e.g. Try sample list, Delete

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI with functional components and hooks |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Utility-first styling |
| **Vite** | Build and dev server |
| **Recharts** | Charts in trade detail modal |

## 📦 Project Structure

```
src/
├── components/
│   ├── constants/
│   │   ├── types.ts        # Trade, MarketDataMap, filters
│   │   └── filterOptions.ts
│   ├── ui-components/
│   │   ├── SelectBox.tsx           # Reusable single/multi select dropdown
│   │   └── TruncateWithTooltip.tsx # Truncate text, tooltip on hover when overflow
│   ├── modals/
│   │   ├── CreateTradeModal.tsx
│   │   ├── TradeDetailModal.tsx
│   │   └── ConfirmModal.tsx
│   ├── TradeListPage.tsx   # Main page
│   ├── TradeTable.tsx      # Table with market data columns
│   └── TradeFilters.tsx
├── hooks/
│   ├── useTrades.ts        # Trade state + localStorage sync
│   ├── useMarketData.ts    # Binance WebSocket subscription
│   └── useCoins.ts         # Symbol list for create form
├── services/
│   ├── tradeStorageService.ts   # localStorage (trade_journal_trades)
│   ├── marketDataService.ts     # Binance WebSocket → MarketDataMap
│   └── coinsService.ts          # Binance exchangeInfo (symbols)
├── utils/
│   ├── calculations.ts    # PNL, duration, R-multiple
│   ├── tradeFilters.ts
│   └── filterStorage.ts
├── data/
│   └── mockTrades.ts      # Sample trades (e.g. ETHBTC, LTCBTC, BTCUSDT)
├── App.tsx
├── main.tsx
└── index.css
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
cd stock-notes
npm install
npm run dev
```

The app runs at **http://localhost:5173**.

### Market Data

Live prices use **Binance public WebSocket** streams. No API key or env vars are required. The app subscribes only to symbols that appear in your trades (e.g. BTCUSDT, ETHUSDT, ETHBTC). Data is transformed into `MarketDataMap` and the table shows **Current Price** and **Daily %** per symbol.

### Building for Production

```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### Creating a Trade

1. Click **"Create New Trade"** in the header.
2. Enter symbol (e.g. BTCUSDT, ETHBTC).
3. Choose position (LONG or SHORT).
4. Set open time, open price, quantity; optionally close time/price, stop loss, notes, tags.
5. Click create; the new trade appears in the table and market data subscribes to its symbol if needed.

### Trade Status

- **OPEN**: Position still held (no close price/time).
- **CLOSED**: Position closed (close price and close timestamp set).

### Try Sample List

Click **"Try sample list"** to add sample trades (symbols include ETHBTC, LTCBTC, BNBBTC, BTCUSDT, ETHUSDT). Useful to see live market data in the table.

## 🏗️ Architecture Notes

- **Trades**: `useTrades` + `tradeStorageService` (localStorage). List is derived from storage; create/update/delete update storage and state.
- **Market data**: `useMarketData(symbols)` uses `marketDataService.subscribeMarketData(symbols, callback)`. The service keeps a single WebSocket, accumulates ticker updates into a `MarketDataMap`, and calls the callback so the table re-renders with latest price and daily %.
- **Types**: Trade and market data types live in `components/constants/types.ts`.

## 🎯 Assumptions & Trade-offs

- **Single user, browser-only**: No auth; data in localStorage.
- **Binance only**: Market data from Binance public streams; symbol format matches Binance (e.g. BTCUSDT).
- **Desktop-first**: Table and filters optimized for desktop; responsive where applicable.

## 🔮 Possible Improvements

- Backend + auth for multi-device sync
- Export/import (CSV/JSON)
- More exchanges or data sources
- Unit and E2E tests
- PWA / offline support
- Dark mode and accessibility

## 🚢 Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Vercel, Netlify, GitHub Pages, and static host options.

## 📄 License

This project is for demonstration purposes.

---

**Built with React, TypeScript, and Tailwind**
