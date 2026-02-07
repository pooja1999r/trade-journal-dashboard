# Architecture Documentation

## System Overview

Trade Journal is a client-side React application for managing crypto trades with **live Binance WebSocket** market data. Trades are stored in localStorage; the UI shows a table with PNL, duration, R-value, and live current price and daily % per symbol.

## Architecture Principles

### 1. Separation of Concerns
- **Components**: Presentation (TradeListPage, TradeTable, TradeFilters, modals, ui-components)
- **Hooks**: useTrades (state + localStorage), useMarketData (WebSocket), useCoins (symbol list)
- **Services**: tradeStorageService, marketDataService, coinsService
- **Utils**: Pure helpers (calculations, tradeFilters, filterStorage)

### 2. Data Flow
- **Trades**: User action → useTrades → tradeStorageService → localStorage → state update → re-render
- **Market data**: Symbols from trades → useMarketData → marketDataService (WebSocket) → MarketDataMap → state → TradeTable re-renders

### 3. Type Safety
Domain types in `components/constants/types.ts` (Trade, MarketDataMap, filters, ConfirmModalVariant). Filter option constants in `components/constants/filterOptions.ts`. TypeScript strict mode enabled.

## Core Domain Model

**Trade** (used by the main UI and storage):

```typescript
Trade {
  id: string
  symbol: string           // e.g. BTCUSDT, ETHBTC
  position: 'LONG' | 'SHORT'
  status: 'OPEN' | 'CLOSED'
  openTimestamp: number
  closeTimestamp?: number
  openPrice: number
  closePrice?: number
  quantity: number
  stopLoss?: number
  rValue?: number
  notes?: string
  tags?: string[]
}
```

**Market data** (per symbol, from Binance):

```typescript
MarketSymbolData {
  symbol: string
  last: string
  last_btc: string
  lowest: string
  highest: string
  date: string
  daily_change_percentage: string
  source_exchange: string
}

MarketDataMap = { [symbol: string]: MarketSymbolData }
```

### Business Rules
- OPEN: no close price/close timestamp. CLOSED: has both.
- PNL: LONG → (closePrice − openPrice) × quantity; SHORT → (openPrice − closePrice) × quantity.
- R-multiple and duration are derived in utils/calculations.ts.

## State and Persistence

### Trades
- **Source of truth**: localStorage key `trade_journal_trades`.
- **Hook**: useTrades() returns { trades, addTrade, updateTrade, deleteTrade, loadTrades }. Reads/writes via tradeStorageService.
- **Symbols**: Derived from trades; tradeStorageService.getUniqueSymbols(trades) drives market data subscription.

### Market Data
- **Source**: Binance WebSocket (wss://stream.binance.com:9443/stream).
- **Hook**: useMarketData(symbols, reconnectTrigger) returns { data: MarketDataMap, isLoading, error }.
- **Service**: marketDataService.subscribeMarketData(symbols, callback) keeps one WebSocket, maps ticker payloads to MarketSymbolData, accumulates into MarketDataMap, and invokes the callback.

### Filters
- Stored in localStorage via filterStorage (loadFilters, saveFilters). Applied in memory in TradeListPage (filterTrades, sortTradesByOpenTimestamp).

## Component Architecture

### Hierarchy
```
App
└── TradeListPage
    ├── Header (inline: title, Try sample list, Create New Trade)
    ├── TradeFilters (uses SelectBox, filterOptions)
    ├── TradeTable (trades + marketData)
    ├── TradeDetailModal (on row click)
    ├── CreateTradeModal
    └── ConfirmModal (e.g. Try sample list, Delete)
```

### Responsibilities
- **TradeListPage**: Orchestrates useTrades, useMarketData, filters, modals; passes filtered trades and marketData to TradeTable.
- **TradeTable**: Renders table; uses marketData[trade.symbol] for current price and daily %; sticky columns, selection.
- **TradeFilters**: Filter UI using SelectBox (symbol, position, status, entry, tags); search notes; calls onFiltersChange.
- **SelectBox** (ui-components): Reusable single/multi select dropdown; used in TradeFilters and CreateTradeModal.
- **CreateTradeModal**: Form for new trade; symbol from useCoins; onSubmit calls addTrade and can trigger WebSocket reconnect.
- **TradeDetailModal**: Trade summary, chart (Recharts), editable notes/tags/status; onUpdate calls updateTrade.
- **ConfirmModal**: Title + close button; variant (default/danger/warning) only affects confirm button color.

## Data Flow Examples

### Creating a Trade
1. User clicks "Create New Trade" → CreateTradeModal opens.
2. User submits form → handleCreateTrade(trade) → addTrade(trade) → tradeStorageService.save → setTrades.
3. Optional: setWsReconnectTrigger so useMarketData re-subscribes with new symbols.
4. TradeTable re-renders with new row; when Binance sends ticker for that symbol, marketData updates and table shows current price and daily %.

### Live Market Data
1. TradeListPage gets symbols from trades → useMarketData(symbols).
2. useMarketData calls marketDataService.subscribeMarketData(symbols, callback).
3. marketDataService opens WebSocket to Binance combined stream, accumulates messages into dataMap, calls callback({ ...dataMap }).
4. Hook setState → TradeListPage re-renders → TradeTable receives new marketData → current price and daily % cells update.

## Services

| Service | Role |
|--------|------|
| **tradeStorageService** | getAll(), save(), getUniqueSymbols(); key `trade_journal_trades` |
| **marketDataService** | subscribeMarketData(symbols, callback) → WebSocket, MarketDataMap callback, cleanup |
| **coinsService** | fetchCoinsList() from Binance exchangeInfo (symbol list for CreateTradeModal) |

## Calculations (utils/calculations.ts)

- **PNL**: By position (LONG/SHORT), open/close price, quantity.
- **Duration**: formatDuration(openTimestamp, closeTimestamp).
- **R-multiple**: PNL and risk from open price, stop loss, quantity.
- **Timestamps**: formatTimestampGMT, toDateTimeLocalGMT, fromDateTimeLocalGMT for GMT display and inputs.

## Styling

- **Tailwind**: Utility classes; responsive where needed.
- **Conventions**: Green (long/buy), red (short/sell), blue (primary/actions), gray (secondary). PNL: green profit, red loss, gray zero.

## Build & Deployment

- **Dev**: `npm run dev` (Vite HMR).
- **Build**: `npm run build` (tsc + vite build) → dist/.
- **Preview**: `npm run preview`.
- Deploy as static site; see DEPLOYMENT.md. No env vars required for Binance market data.

## Security and Limitations

- No authentication; single-user, browser-only.
- localStorage is not encrypted.
- Market data is public Binance streams (no API key); no sensitive data is sent.
- No pagination; all trades loaded at once. No cross-device sync.

## Extensibility

- **New trade field**: Add to Trade in types.ts, CreateTradeModal, TradeTable, TradeDetailModal, mockTrades.
- **New calculation**: Add to utils/calculations.ts and use in table or modal.
- **New filter option**: Add to filterOptions.ts and use in TradeFilters SelectBox.
- **New market source**: Implement same callback contract as marketDataService (symbols → callback(MarketDataMap)) and swap in useMarketData.

## Dependencies

| Package | Purpose |
|---------|---------|
| React | UI |
| TypeScript | Types |
| Tailwind | Styling |
| Vite | Build and dev server |
| Recharts | Charts in TradeDetailModal |

For setup and usage, see README.md and QUICKSTART.md.
