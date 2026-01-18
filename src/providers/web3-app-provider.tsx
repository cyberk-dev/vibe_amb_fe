import { GlobalConfirmDialogContainer } from "@/shared/ui/global-confirm-dialog-container";
import { LocalizationProvider } from "@/shared/i18n";
// COMMENTED: EVM Wallet Provider - app now uses Aptos
// import { WalletProvider } from "@/integrations/reown-appkit/appkit-provider";
// Direct import to avoid pulling in client.ts (has Node.js-only dependencies)
import { AptosProvider } from "@/integrations/aptos/aptos-provider";
import { PersistQueryProvider } from "@/shared/api";
import { ThemeProvider } from "@/providers/theme-provider";
// COMMENTED: EVM cookie handling - not needed for Aptos
// import { headers } from "next/headers";
import { Toaster } from "sonner";

// MODIFIED: Removed async - Aptos provider doesn't need server-side cookies
export const Web3AppProvider = ({ children }: { children: React.ReactNode }) => {
  // COMMENTED: EVM cookie handling
  // const headersObj = await headers();
  // const cookies = headersObj.get("cookie");
  return (
    <ThemeProvider>
      <PersistQueryProvider>
        {/* COMMENTED: EVM Wallet Provider - restore when needed */}
        {/* <WalletProvider cookies={cookies}> */}
        <AptosProvider>
          <LocalizationProvider>
            {children}
            <GlobalConfirmDialogContainer />
            <Toaster richColors position="bottom-right" />
          </LocalizationProvider>
        </AptosProvider>
        {/* </WalletProvider> */}
      </PersistQueryProvider>
    </ThemeProvider>
  );
};
