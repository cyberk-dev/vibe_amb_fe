# CyberK Next.js Boilerplate

A modern, production-ready Next.js boilerplate with Web3 wallet integration, built with the latest technologies and best practices.

## ✨ Features

- 🚀 **Next.js 15.5.0** with App Router and Turbopack
- ⚛️ **React 19.1.0** with latest features
- 🎨 **Tailwind CSS v4** for styling
- 🎯 **TypeScript** with strict configuration
- 🔗 **Web3 Integration** with Wagmi and AppKit
- 🎨 **Shadcn/ui** components for consistent UI
- 🌐 **Multi-environment** support (.env.local, .env.dev, .env.production)
- 📱 **Responsive Design** with mobile-first approach
- 🎛️ **ESLint** configuration for code quality

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Mono (optimized with next/font)

### Web3 & Blockchain
- **Wallet Integration**: @reown/appkit (formerly WalletConnect)
- **React Hooks**: Wagmi v2.16.4
- **Blockchain Utilities**: Viem v2.34.0
- **Supported Networks**: Ethereum, Arbitrum, Polygon
- **State Management**: TanStack Query v5.85.5

### Development Tools
- **Bundler**: Turbopack (Next.js experimental)
- **Linting**: ESLint with Next.js rules
- **Environment**: Dotenv with multi-env support
- **Package Manager**: PNPM (recommended)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PNPM (recommended) or npm/yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyberk-nextjs-boilerplate
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment templates
   cp .env.local .env.local.example
   cp .env.dev .env.dev.example
   cp .env.production .env.production.example
   ```

4. **Configure WalletConnect Project ID**
   ```bash
   # Edit .env.local and add your WalletConnect Project ID
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
   ```

   Get your project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### Development Scripts

#### Local Development
```bash
# Run with .env.local (default)
pnpm dev:local

# Build with local environment
pnpm build:local

# Start production server with local env
pnpm start:local
```

#### Development Environment
```bash
# Run with .env.dev
pnpm dev:dev

# Build with dev environment
pnpm build:dev

# Start with dev environment
pnpm start:dev
```

#### Production Environment
```bash
# Run with .env.production
pnpm dev:prod

# Build with production environment
pnpm build:prod

# Start with production environment
pnpm start:prod
```

#### Other Commands
```bash
# Lint code
pnpm lint

# Add Shadcn components
pnpx shadcn@latest add [component-name]
```

## 🌍 Environment Configuration

The project supports multiple environments with dedicated configuration files:

### `.env.local` (Local Development)
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id
```

## 🔗 Web3 Wallet Integration

### Demo
Visit `/wallet-connect` to see the wallet integration in action.

### Adding New Components
```bash
# Add individual components
pnpx shadcn@latest add button
pnpx shadcn@latest add card
pnpx shadcn@latest add dialog

# View all available components
pnpx shadcn@latest add
```