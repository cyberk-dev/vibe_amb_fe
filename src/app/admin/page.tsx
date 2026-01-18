"use client";

import dynamic from "next/dynamic";

// Note: metadata export moved to layout.tsx because this is now a Client Component

// Dynamic import with ssr: false to prevent Aptos SDK from being bundled in SSR
// This avoids the keyv/got module resolution issues
const AdminScreen = dynamic(() => import("@/screens/admin").then((mod) => mod.AdminScreen), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center">
      <div className="text-gray-400">Loading Admin Dashboard...</div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminScreen />;
}
