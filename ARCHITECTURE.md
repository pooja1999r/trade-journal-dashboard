# Architecture Documentation

## System Overview

Trade Journal is a client-side React application for managing trading positions with multiple entry and exit points.

## Architecture Principles

### 1. Separation of Concerns
- **Components**: Pure presentation logic
- **Store**: State management and business logic
- **Utils**: Pure helper functions
- **Pages**: Route-level composition

### 2. Unidirectional Data Flow
```
User Action → Redux Action → Reducer → State Update → Component Re-render
```

### 3. Type Safety First
All data structures are strictly typed. The type system prevents invalid states at compile time.

## Core Domain Model

```typescript
TradeLeg {
  id: string
  price: number
  quantity: number
  timestamp: string
}

Trade {
  id: string
  symbol: string
  direction: 'LONG' | 'SHORT'
  status: 'OPEN' | 'CLOSED'
  buyLegs: TradeLeg[]
  sellLegs: TradeLeg[]
  createdAt: string
  notes?: string
}
```

### Business Rules
1. A trade must have at least one leg (buy or sell)
2. Open trades have no sell legs (for LONG) or no buy legs (for SHORT)
3. Closed trades have both buy and sell legs
4. All prices and quantities must be positive numbers
5. Timestamps are ISO 8601 strings

## State Management

### Redux Store Structure
```typescript
{
  trades: {
    trades: Trade[]
  }
}
```

### Actions
- `addTrade`: Add new trade to store
- `addBuyLeg`: Add buy leg to existing trade
- `addSellLeg`: Add sell leg to existing trade
- `closeTrade`: Mark trade as closed
- `updateTradeNotes`: Update trade notes
- `deleteTrade`: Remove trade from store
- `loadMockData`: Load demo data

### Side Effects
- All actions trigger localStorage save
- Store hydrates from localStorage on initialization

## Component Architecture

### Hierarchy
```
App
└── Provider (Redux)
    ├── Header
    │   └── Actions (New Trade, Load Data)
    ├── TradeList
    │   ├── Stats & Filters
    │   └── TradeCard (for each trade)
    │       ├── TradeLegList (Buy)
    │       ├── Trade Details (Center)
    │       └── TradeLegList (Sell)
    └── TradeForm (Modal)
        ├── Trade Info
        ├── Buy Legs Section
        └── Sell Legs Section
```

### Component Responsibilities

**TradeCard**
- Display trade in three-column layout
- Calculate and show metrics
- Handle trade actions (close, delete)

**TradeLegList**
- Display list of legs
- Color-coded by type (buy/sell)
- Show price, quantity, timestamp

**TradeForm**
- Collect trade information
- Dynamically add/remove legs
- Validate input
- Dispatch addTrade action

**TradeList**
- Filter trades by status
- Display statistics
- Render all trade cards

## Data Flow Examples

### Creating a Trade
```
1. User clicks "+ New Trade"
2. TradeForm modal opens
3. User fills form and adds legs
4. User clicks "Create Trade"
5. TradeForm validates input
6. TradeForm dispatches addTrade(newTrade)
7. Redux reducer adds trade to state
8. Reducer calls saveToLocalStorage()
9. State updates trigger re-render
10. TradeList shows new trade
11. Modal closes
```

### Filtering Trades
```
1. User clicks "Open" filter button
2. TradeList updates local filter state
3. Component re-renders with filtered trades
4. Only open trades are displayed
```

## Persistence Strategy

### localStorage Schema
```javascript
{
  "trade-journal-data": "[{trade1}, {trade2}, ...]"
}
```

### Load Strategy
1. App initializes
2. Redux store reads from localStorage
3. Parses JSON or uses empty array on error
4. Hydrates initial state

### Save Strategy
1. Every action that modifies trades
2. Calls `saveToLocalStorage(trades)`
3. Serializes to JSON
4. Writes to localStorage

### Error Handling
- Parse errors default to empty array
- Write errors are logged but don't crash app
- User data remains in memory even if save fails

## Calculation Logic

### Average Price
```
weighted_avg = sum(price * quantity) / sum(quantity)
```

### Profit & Loss
```
LONG: P&L = (Total Sell Value) - (Total Buy Value)
SHORT: P&L = (Total Buy Value) - (Total Sell Value)
```

### Total Value
```
value = sum(price * quantity for all legs)
```

## Styling Strategy

### Tailwind Utility Classes
- Rapid development
- Consistent spacing and colors
- Built-in responsive utilities
- Tree-shaking for small bundles

### Color Coding
- **Green**: Buy legs and long positions
- **Red**: Sell legs and short positions
- **Blue**: Open trades and primary actions
- **Gray**: Closed trades and secondary info

### Responsive Design
- Desktop-first approach
- Grid layout adapts to screen size
- Modal scrolls on small screens

## Build & Deployment

### Development Build
```bash
npm run dev
```
- Vite dev server with HMR
- Fast refresh for React
- Source maps enabled

### Production Build
```bash
npm run build
```
- TypeScript compilation check
- Vite bundle optimization
- Minification and tree-shaking
- Output to `dist/` folder

### Deployment Targets
- Vercel: Zero-config deployment
- Netlify: Drop-in dist folder
- Any static host: Serve dist folder

## Testing Strategy (Future)

### Unit Tests
- Redux reducers (pure functions)
- Utility functions (calculations, formatting)
- Component rendering

### Integration Tests
- User flows (create trade, filter trades)
- Redux store interactions
- localStorage persistence

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Responsive design verification

## Performance Considerations

### Current Optimizations
- React.memo potential for TradeCard
- Efficient Redux selector usage
- Tailwind CSS purging in production

### Future Optimizations
- Virtual scrolling for large lists
- Lazy loading of trade details
- Web Workers for calculations
- Code splitting by route

## Security Considerations

### Current State
- No authentication/authorization
- Client-side only
- localStorage is not encrypted

### Future Enhancements
- User authentication
- Server-side storage
- Data encryption
- Rate limiting on actions

## Extensibility

### Adding New Features

**New Trade Field**
1. Add to `Trade` type in `types.ts`
2. Add to `TradeForm` component
3. Add to `TradeCard` display
4. Update mock data

**New Calculation**
1. Add pure function to `calculations.ts`
2. Import in component
3. Display result in UI

**New Redux Action**
1. Add case to `tradeSlice.ts`
2. Export action
3. Dispatch from component

## Known Limitations

1. **No pagination**: All trades load at once
2. **No search**: Must scroll to find trades
3. **No undo**: Deletes are permanent
4. **No editing**: Must delete and recreate
5. **Browser-only**: No mobile app
6. **Single device**: No sync across devices

## Dependencies Rationale

| Package | Why? |
|---------|------|
| React | Industry standard, great ecosystem |
| Redux Toolkit | Best practice Redux with less boilerplate |
| TypeScript | Compile-time safety, better DX |
| Tailwind | Fast styling, consistent design |
| Vite | Fastest build tool, great DX |

## Code Quality Measures

- TypeScript strict mode enabled
- ESLint with recommended rules
- Consistent naming conventions
- Inline documentation
- Separation of concerns
- DRY principle followed
