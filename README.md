# Trade Journal

A production-quality React application for tracking and managing trading positions with multiple buy and sell legs.

## 📋 Overview

Trade Journal is a frontend application designed for traders to record, visualize, and manage their trading positions. Each trade can contain multiple entry (buy) and exit (sell) points, providing a complete picture of trading activity.

The application emphasizes:
- **Clean state modeling** with normalized data structures
- **Clear UI/UX** with a distinctive three-column layout (BUY | TRADE | SELL)
- **Scalable architecture** ready for production deployment
- **Type safety** with TypeScript throughout

## ✨ Features

### Core Features
- **Trade Management**
  - Create trades with multiple buy and sell legs
  - Track long and short positions
  - Distinguish between open and closed trades
  - Add notes to trades for context

- **Three-Column Layout**
  - Buy legs displayed in left column (green)
  - Trade details in center column (gray)
  - Sell legs displayed in right column (red)
  - Visual separation for quick scanning

- **Trade Calculations**
  - Total buy/sell quantities
  - Weighted average prices
  - Profit & Loss for closed trades
  - Real-time calculations

- **Data Persistence**
  - Automatic localStorage persistence
  - State hydration on app load
  - Demo data available for testing

- **Filtering & Sorting**
  - Filter by status (All, Open, Closed)
  - Sort by creation date
  - Trade statistics dashboard

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
├── components/           # Reusable UI components
│   ├── TradeCard/       # Three-column trade display
│   ├── TradeLegList/    # Buy/sell leg visualization
│   ├── TradeForm/       # Create trade modal
│   └── Layout/          # Header and layout components
├── pages/               # Page-level components
│   └── TradeList.tsx    # Main trade list page
├── store/               # Redux state management
│   ├── types.ts         # TypeScript type definitions
│   ├── tradeSlice.ts    # Trade actions and reducers
│   ├── store.ts         # Store configuration
│   └── hooks.ts         # Typed Redux hooks
├── utils/               # Utility functions
│   ├── storage.ts       # localStorage persistence
│   ├── calculations.ts  # Trade calculations
│   └── mockData.ts      # Demo data
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository (or extract the zip)
cd stock-notes

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

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
