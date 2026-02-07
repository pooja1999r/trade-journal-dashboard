# Quick Start Guide

## Get Running in 3 Steps

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173
```

## First Time Using the App?

1. Click **"Try sample list"** to add sample trades (e.g. BTCUSDT, ETHUSDT, ETHBTC, LTCBTC, BNBBTC).
2. Watch the **Current Price** and **Daily %** columns update from Binance (live WebSocket).
3. Click **"Create New Trade"** to add your own trade.
4. Click a row to open the **Trade Detail** modal (chart, notes, tags).

## Key Features to Try

### Create a Trade
- Symbol: e.g. **BTCUSDT** or **ETHUSDT**
- Position: **LONG** or **SHORT**
- Open price, quantity, optional close price and stop loss
- Add notes and tags, then click create

### Filter Trades
Use the filters (symbol, position, status, tags, search notes) to narrow the list.

### Edit a Trade
Click a row → in the detail modal, edit notes or tags and save.

## Project Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack

- **React 18** – UI
- **TypeScript** – Types
- **Tailwind CSS** – Styling
- **Vite** – Build and dev server
- **Recharts** – Charts in detail modal
- **Binance WebSocket** – Live prices (no API key)

## File Structure Highlights

```
src/
├── components/            # UI
│   ├── constants/           # types.ts, filterOptions.ts
│   ├── ui-components/       # SelectBox
│   ├── TradeListPage.tsx    # Main page
│   ├── TradeTable.tsx       # Table + market data columns
│   ├── TradeFilters.tsx
│   └── modals/              # CreateTrade, TradeDetail, Confirm
├── hooks/
│   ├── useTrades.ts         # Trades + localStorage
│   ├── useMarketData.ts     # Binance WebSocket
│   └── useCoins.ts          # Symbol list for create form
├── services/
│   ├── tradeStorageService.ts
│   ├── marketDataService.ts
│   └── coinsService.ts
└── utils/                  # calculations, tradeFilters, filterStorage
```

## Need Help?

- Full docs: [README.md](./README.md)
- Deployment: [DEPLOYMENT.md](./DEPLOYMENT.md)
- Architecture: [ARCHITECTURE.md](./ARCHITECTURE.md)
