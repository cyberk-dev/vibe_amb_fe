"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AdminDashboard } from "@/widgets/admin-dashboard";

export function AdminScreen() {
  const { connected, account, connect, disconnect, wallets } = useWallet();

  const installedWallets = wallets?.filter((w) => w.readyState === "Installed") ?? [];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lucky Survivor Admin</h1>
          <p className="mt-2 text-gray-400">
            Manage game sessions and monitor player activity
          </p>
        </div>

        <div>
          {connected ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">
                {account?.address?.toString().slice(0, 6)}...
                {account?.address?.toString().slice(-4)}
              </span>
              <button
                onClick={disconnect}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              {installedWallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => connect(wallet.name)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Connect {wallet.name}
                </button>
              ))}
              {installedWallets.length === 0 && (
                <a
                  href="https://petra.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
                >
                  Install Petra Wallet
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {connected ? (
        <AdminDashboard />
      ) : (
        <div className="flex h-96 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-gray-400">
            Please connect your Aptos wallet to access admin dashboard
          </p>
        </div>
      )}
    </div>
  );
}
