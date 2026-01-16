"use client";

import { FormattedMessage } from "react-intl";
import { WalletConnectContainer } from "./_components/wallet-connect-container";
import { Badge } from "@/shared/ui/badge";
import { Typography3XL, TypographyLG } from "@/shared/ui/typography";
import { Header, Footer } from "@/widgets/layout";

const WalletConnectPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-3 md:space-y-4">
            <Badge variant="outline" className="text-xs">
              <FormattedMessage id="wallet_connect.page.badge" />
            </Badge>
            <Typography3XL as="h1" className="font-bold tracking-tight">
              <FormattedMessage id="wallet_connect.page.title" />
            </Typography3XL>
            <TypographyLG className="text-muted-foreground">
              <FormattedMessage id="wallet_connect.page.description" />
            </TypographyLG>
          </div>

          <WalletConnectContainer />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WalletConnectPage;
