"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AdminDashboard } from "@/widgets/admin-dashboard";
import { useHoverSound } from "@/shared/lib";

export function AdminScreen() {
  const { connected, account, connect, disconnect, wallets } = useWallet();
  const { onMouseEnter: playHoverSound } = useHoverSound();

  // Only show Petra wallet
  const petraWallet = wallets?.find((w) => w.name === "Petra");

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lucky Survivor Admin</h1>
          <p className="mt-2 text-gray-400">Manage game sessions and monitor player activity</p>
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
                onMouseEnter={playHoverSound}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Disconnect
              </button>
            </div>
          ) : petraWallet ? (
            <button
              onClick={() => connect(petraWallet.name)}
              onMouseEnter={playHoverSound}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Connect Petra
            </button>
          ) : (
            <a
              href="https://petra.app/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHoverSound}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
            >
              Install Petra Wallet
            </a>
          )}
        </div>
      </header>

      {connected ? (
        <AdminDashboard />
      ) : (
        <div className="flex h-96 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-gray-400">Please connect your Petra wallet to access admin dashboard</p>
        </div>
      )}
    </div>
  );
}
