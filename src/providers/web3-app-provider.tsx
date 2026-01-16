import { GlobalConfirmDialogContainer } from "@/shared/ui/global-confirm-dialog-container";
import { LocalizationProvider } from "@/shared/i18n";
import { WalletProvider } from "@/integrations/reown-appkit/appkit-provider";
import { PersistQueryProvider } from "@/shared/api";
import { ThemeProvider } from "@/providers/theme-provider";
import { headers } from "next/headers";
import { Toaster } from "sonner";

export const Web3AppProvider = async ({ children }: { children: React.ReactNode }) => {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");
  return (
    <ThemeProvider>
      <PersistQueryProvider>
        <WalletProvider cookies={cookies}>
          <LocalizationProvider>
            {children}
            <GlobalConfirmDialogContainer />
            <Toaster richColors position="bottom-right" />
          </LocalizationProvider>
        </WalletProvider>
      </PersistQueryProvider>
    </ThemeProvider>
  );
};
