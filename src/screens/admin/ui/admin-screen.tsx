"use client";

import { AdminDashboard } from "@/widgets/admin-dashboard";

export function AdminScreen() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Lucky Survivor Admin</h1>
        <p className="mt-2 text-gray-400">
          Manage game sessions and monitor player activity
        </p>
      </header>

      <AdminDashboard />
    </div>
  );
}
