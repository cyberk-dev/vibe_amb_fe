import { WalletConnectContainer } from './_components/wallet-connect-container';

const WalletConnectPage = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Wallet Connection Demo</h1>
          <p className="text-muted-foreground text-lg">
            This demo shows how to connect wallets using AppKit and Wagmi
          </p>
        </div>
        
        <WalletConnectContainer />
        
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Features Included:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>&bull; AppKit modal for wallet selection</li>
            <li>&bull; Support for multiple chains (Ethereum, Arbitrum, Polygon)</li>
            <li>&bull; Real-time balance display</li>
            <li>&bull; Account and chain information</li>
            <li>&bull; Disconnect functionality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WalletConnectPage;