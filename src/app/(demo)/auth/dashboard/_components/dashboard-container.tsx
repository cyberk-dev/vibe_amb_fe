"use client";

import { useRouter } from "next/navigation";
import { useUser } from "@/stores/auth-store";
import { useLogoutMutation } from "@/hooks/use-auth-mutation";
import { Dashboard } from "./dashboard";

export const DashboardContainer = () => {
  const user = useUser();
  const logoutMutation = useLogoutMutation();
  const router = useRouter();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/auth");
      },
    });
  };

  const handleBackToDemo = () => {
    router.push("/auth");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={handleLogout}
      onBackToDemo={handleBackToDemo}
      isLoggingOut={logoutMutation.isPending}
    />
  );
};