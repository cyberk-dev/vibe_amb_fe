"use client";

import { TokenFactoryDemo } from "./_components/token-factory-demo";
import { Badge } from "@/components/ui/badge";
import { Typography3XL, TypographyLG } from "@/components/typography";
import { Header, Footer } from "@/components/layout";

const SmartContractPage = () => {
  return (
    <div className="font-sans flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 container mx-auto py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
          <div className="text-center space-y-3 md:space-y-4">
            <Badge variant="outline" className="text-xs">
              TokenFactory Demo
            </Badge>
            <Typography3XL as="h1" className="font-bold tracking-tight">
              Smart Contract Interaction
            </Typography3XL>
            <TypographyLG className="text-muted-foreground">
              Interact with TokenFactory contract on Sepolia Ethereum. Read deployed tokens and create new ERC20 tokens.
            </TypographyLG>
          </div>

          <TokenFactoryDemo />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SmartContractPage;
