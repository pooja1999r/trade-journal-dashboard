# Trade Journal

A production-quality React application for tracking crypto trades with live market data integration.

## 📋 Overview

Trade Journal is a frontend application for traders to record, visualize, and manage trading positions. It fetches **live market data** from a crypto price API for symbols stored in localStorage, merging it with user-recorded trade data. Trades support LONG/SHORT positions with open/close prices, PNL, R-multiple, and more.

The application emphasizes:
- **Clean state modeling** with normalized data structures
- **Clear UI/UX** with a distinctive three-column layout (BUY | TRADE | SELL)
- **Scalable architecture** ready for production deployment
- **Type safety** with TypeScript throughout

## ✨ Features

### Core Features
- **Trade Management**
  - Create trades with symbol, position (LONG/SHORT), open/close timestamps and prices
  - Stop loss, R-value, notes, tags
  - Editable notes and tags in detail modal

- **Trade Table**
  - Symbol, Position, Open/Close Time, Duration
  - Open/Close Price, PNL (green/red), R-Value, Stop Loss
  - Tags, Notes
  - **Current Market Price** and Daily % Change from API
  - Sorted by openTimestamp (latest first)

- **Derived Fields**
  - PNL: LONG → (closePrice − openPrice) × quantity; SHORT → (openPrice − closePrice) × quantity
  - Human-readable duration (e.g. 2h 15m)
  - R-Multiple: PNL ÷ risk per trade

- **Market Data**
  - Fetches live prices only for symbols in localStorage
  - API key via Authorization header
  - Falls back to mock data when API not configured
  - Batched/parallel requests

- **Filters & Search**
  - Filter by symbol, position (LONG/SHORT), tags (multi-select)
  - Search by notes text
  - Filters persisted in localStorage

- **Trade Detail Modal**
  - Row click opens modal with trade summary
  - Entry & exit markers on line chart (Recharts)
  - Editable notes & tags

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with functional components and hooks |
| **TypeScript** | Type safety and better developer experience |
| **Redux Toolkit** | Predictable state management with modern best practices |
| **Tailwind CSS** | Utility-first styling for rapid UI development |
| **Vite** | Fast build tool and dev server |

## 📦 Project Structure

```
src/
├── components/
│   ├── TradeTable/        # Main trade table with all columns
│   ├── TradeFilters/      # Symbol, position, tags, search
│   ├── TradeDetailModal/  # Detail view with chart (Recharts)
│   └── CreateTradeForm/   # Create trade modal
├── pages/
│   └── TradeListPage.tsx  # Main page
├── services/
│   ├── tradeStorageService.ts   # localStorage (key: trade_journal_trades)
│   └── marketDataService.ts     # Crypto price API
├── hooks/
│   ├── useTrades.ts       # Trade state + localStorage sync
│   └── useMarketData.ts   # Fetch market data for trade symbols
├── types/
│   └── index.ts           # Trade, MarketData, filters
├── utils/
│   ├── calculations.ts    # PNL, duration, R-multiple
│   ├── tradeFilters.ts    # Client-side filtering
│   ├── filterStorage.ts   # Persist filters
│   └── mockMarketData.ts  # Fallback when API unavailable
├── data/
│   └── mockTrades.ts      # Demo trades
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

The application will be available at `http://localhost:5173`

### API Configuration (Optional)

To use live market data, create `.env` and set:

```
VITE_API_URL=https://your-api.com/crypto/prices
VITE_API_KEY=your-api-key
```

API must return data in this shape:

```json
{
  "status": "success",
  "symbols": [
    {
      "symbol": "BTC",
      "last": "63556.38",
      "daily_change_percentage": "-13.53",
      ...
    }
  ]
}
```

When not configured, **mock data** is used.

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📖 Usage Guide

### Creating a Trade

1. Click **"+ New Trade"** button in the header
2. Enter the symbol (e.g., AAPL, BTCUSDT)
3. Select direction (LONG or SHORT)
4. Add buy legs:
   - Enter price and quantity
   - Select timestamp
   - Click "+ Add Buy Leg"
5. Add sell legs (same process)
6. Optionally add notes
7. Click "Create Trade"

### Understanding Trade Status

- **OPEN**: Trade has buy legs but no sell legs (position is active)
- **CLOSED**: Trade has both buy and sell legs (position is closed)

### Loading Demo Data

Click **"Load Demo Data"** in the header to populate the application with sample trades showcasing different scenarios.

## 🏗️ Architecture Decisions

### State Management
**Decision**: Redux Toolkit
**Rationale**: Provides predictable state management with minimal boilerplate. The centralized store makes it easy to add features like undo/redo, time-travel debugging, or middleware for analytics.

### Type System
**Decision**: Strict TypeScript with explicit types
**Rationale**: Prevents runtime errors, improves IDE support, and serves as living documentation. The `types.ts` file defines the domain model explicitly.

### Component Architecture
**Decision**: Functional components with hooks
**Rationale**: Modern React best practice. Easier to test, compose, and reason about. No class component overhead.

### Styling Approach
**Decision**: Tailwind CSS
**Rationale**: Rapid development, consistent design system, excellent tree-shaking for production. Avoids CSS naming conflicts and makes responsive design trivial.

### Persistence Layer
**Decision**: localStorage with clean abstraction
**Rationale**: No backend required for this assignment. The `storage.ts` utility provides a clean interface that could easily be swapped for an API client later.

## 🎯 Trade-offs & Assumptions

### Assumptions
1. **Single User**: No authentication or multi-user support
2. **Browser Storage**: localStorage is sufficient for data persistence
3. **No Real-time Data**: All trade data is manually entered
4. **Desktop First**: UI optimized for desktop viewing (responsive design possible)

### Trade-offs
1. **Redux vs Context API**: Chose Redux for scalability even though Context might be simpler for this scope
2. **No Backend**: Saves complexity but limits data portability
3. **Inline Actions**: Trade actions (close, delete) are on each card for quick access
4. **No Editing**: Trades can't be edited after creation (only deleted) to maintain audit trail integrity

## 🔮 Future Improvements

### Feature Enhancements
- [ ] **Edit Trades**: Allow modifying existing trades and legs
- [ ] **Trade Search**: Full-text search by symbol or notes
- [ ] **Advanced Filtering**: Filter by date range, symbol, P&L
- [ ] **Export/Import**: CSV/JSON export for backup and analysis
- [ ] **Charts**: Visual P&L charts and trade history graphs
- [ ] **Tags**: Categorize trades by strategy, market condition, etc.
- [ ] **Trade Journal**: Long-form notes and attachments per trade

### Technical Improvements
- [ ] **Backend Integration**: Replace localStorage with REST API
- [ ] **Authentication**: User accounts and secure data storage
- [ ] **Real-time Updates**: WebSocket for live price updates
- [ ] **Mobile App**: React Native version
- [ ] **Unit Tests**: Jest + React Testing Library
- [ ] **E2E Tests**: Playwright or Cypress
- [ ] **Performance**: Virtual scrolling for large trade lists
- [ ] **Offline Support**: Service Worker and PWA features
- [ ] **Dark Mode**: Theme toggle
- [ ] **Accessibility**: Full WCAG 2.1 AA compliance

### UX Improvements
- [ ] **Keyboard Shortcuts**: Quick actions without mouse
- [ ] **Undo/Redo**: Reverse accidental actions
- [ ] **Bulk Operations**: Close/delete multiple trades
- [ ] **Trade Templates**: Quick-create common trade types
- [ ] **Notifications**: Alerts for profit targets or stop losses
- [ ] **Onboarding**: Interactive tutorial for first-time users

## 🚢 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Environment Configuration

No environment variables required for the base application. If adding backend integration:

```env
VITE_API_URL=https://your-api.com
VITE_API_KEY=your-api-key
```

## 📄 License

This project is created for a technical hiring assignment.

## 🤝 Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive test coverage
- Implementing proper error boundaries
- Adding analytics and monitoring
- Setting up CI/CD pipelines
- Implementing proper logging

## 📞 Support

For questions or issues with this project, please review the code comments and architecture documentation above.

---

**Built with ❤️ using React, TypeScript, and Redux Toolkit**
