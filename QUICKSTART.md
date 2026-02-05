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

1. Click **"Load Demo Data"** to see example trades
2. Click **"+ New Trade"** to create your first trade
3. Explore the three-column layout: BUY | TRADE | SELL

## Key Features to Try

### Create a Trade
- Symbol: AAPL
- Direction: LONG
- Add Buy Leg: Price $150, Quantity 100
- Add Sell Leg: Price $155, Quantity 100
- Click "Create Trade"

### Filter Trades
Use the filter buttons (All / Open / Closed) to organize your view.

### Close a Trade
Open trades can be closed using the "Close Trade" button in the center column.

## Project Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Tech Stack Overview

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## File Structure Highlights

```
src/
├── components/       # UI components
│   ├── TradeCard/   # Main trade display (3-column)
│   ├── TradeForm/   # Create trade modal
│   └── TradeLegList/ # Buy/sell leg lists
├── store/           # Redux state
├── utils/           # Helper functions
└── pages/           # Page components
```

## Need Help?

Check the main [README.md](./README.md) for detailed documentation.
