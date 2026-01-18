import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Lucky Survivor",
  description: "Manage Lucky Survivor game sessions",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
