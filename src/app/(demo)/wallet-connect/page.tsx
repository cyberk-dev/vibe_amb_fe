import { WalletConnectContainer } from './_components/wallet-connect-container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const WalletConnectPage = () => {
  const features = [
    "AppKit modal for wallet selection",
    "Support for multiple chains (Ethereum, Arbitrum, Polygon)",
    "Real-time balance display",
    "Account and chain information",
    "Disconnect functionality"
  ];

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Badge variant="outline" className="text-xs">
            Demo
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight">Wallet Connection</h1>
          <p className="text-muted-foreground text-lg">
            Seamlessly connect your Web3 wallet using AppKit and Wagmi
          </p>
        </div>
        
        <WalletConnectContainer />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features Included</CardTitle>
            <CardDescription>
              Everything you need for wallet integration
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletConnectPage;