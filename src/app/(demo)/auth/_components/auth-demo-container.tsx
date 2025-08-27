"use client";

import { useState } from "react";
import { useUser, useIsAuthenticated } from "@/stores/auth-store";
import { AuthDemo } from "./auth-demo";

export const AuthDemoContainer = () => {
  const user = useUser();
  const isAuthenticated = useIsAuthenticated();
  const [currentView, setCurrentView] = useState<"login" | "register" | "profile">("login");

  return (
    <AuthDemo
      isAuthenticated={isAuthenticated}
      user={user}
      currentView={currentView}
      onViewChange={setCurrentView}
    />
  );
};