# Wallet Connection with AppKit and Wagmi

This project includes a complete wallet connection setup using Reown AppKit and Wagmi.

## Setup Instructions

1. **Get a WalletConnect Project ID**:
   - Visit [Reown Cloud](https://cloud.reown.com)
   - Create a new project
   - Copy the Project ID

2. **Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your Project ID:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_actual_project_id
   ```

## Demo Page

Visit `/wallet-connect` to see the wallet connection demo featuring:

- **Multi-chain Support**: Ethereum, Arbitrum, Polygon
- **Wallet Selection**: AppKit modal with popular wallet options
- **Account Info**: Address, balance, and network display
- **Disconnect**: Clean wallet disconnection

## Architecture

### Components Structure

```
src/app/(demo)/wallet-connect/
├── page.tsx                           # Demo page
└── _components/
    ├── wallet-connect-container.tsx    # Container (business logic)
    ├── connect-button.tsx              # Presentation component
    └── wallet-info.tsx                 # Presentation component
```

### Configuration Files

```
src/lib/
├── wagmi.ts                    # Wagmi & AppKit configuration
├── configs/
│   └── env.ts                  # Environment validation
└── providers/
    ├── wallet-provider.tsx     # Wagmi provider
    └── query-provider.tsx      # React Query provider
```

## Usage in Components

```tsx
import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { useAppKit } from '@reown/appkit/react';

const MyComponent = () => {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { disconnect } = useDisconnect();
  
  // Component logic here
};
```

## Supported Chains

- **Ethereum Mainnet** (Default)
- **Arbitrum**
- **Polygon**

Additional chains can be added in `src/lib/wagmi.ts`.

## Features Included

- ✅ AppKit wallet modal
- ✅ Multi-chain support
- ✅ Balance display
- ✅ Account information
- ✅ Proper error handling
- ✅ TypeScript support
- ✅ SSR compatibility