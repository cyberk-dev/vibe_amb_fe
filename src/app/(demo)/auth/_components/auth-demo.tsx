"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoginFormContainer } from "@/components/forms/login-form-container";
import { RegisterFormContainer } from "@/components/forms/register-form-container";
import { UserProfileDisplay } from "./user-profile-display";

interface AuthDemoProps {
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
  } | null;
  currentView: "login" | "register" | "profile";
  onViewChange: (view: "login" | "register" | "profile") => void;
}

export const AuthDemo = ({
  isAuthenticated,
  user,
  currentView,
  onViewChange,
}: AuthDemoProps) => {
  if (isAuthenticated && user) {
    return (
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-2">
            <p className="text-green-600 font-medium">✅ Authenticated</p>
            <p className="text-sm text-gray-600">
              You are successfully logged in and the auth store is working correctly.
            </p>
          </div>
        </Card>

        <UserProfileDisplay user={user} />

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-3">Demo Features</h3>
          <div className="grid gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">✅ Zustand Auth Store</h4>
              <p className="text-sm text-gray-600">
                Following atomic selectors pattern with actions namespace
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">✅ Form Validation</h4>
              <p className="text-sm text-gray-600">
                Using Zod schemas with proper error handling
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">✅ Component Architecture</h4>
              <p className="text-sm text-gray-600">
                Separation of presentation and container components
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <h4 className="font-medium">✅ Persistence</h4>
              <p className="text-sm text-gray-600">
                Auth state persisted to localStorage with migrations
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-center space-x-4 mb-6">
          <Button
            variant={currentView === "login" ? "default" : "outline"}
            onClick={() => onViewChange("login")}
          >
            Login
          </Button>
          <Button
            variant={currentView === "register" ? "default" : "outline"}
            onClick={() => onViewChange("register")}
          >
            Register
          </Button>
        </div>

        {currentView === "login" && <LoginFormContainer />}
        {currentView === "register" && <RegisterFormContainer />}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Architecture Highlights</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Auth Store:</strong> Located at <code>src/stores/auth-store.ts</code>
            <ul className="ml-4 mt-1 text-gray-600">
              <li>• Uses atomic selectors (useUser, useIsAuthenticated, useAuthActions)</li>
              <li>• Actions namespace for business logic</li>
              <li>• Zustand v5 with createJSONStorage and persistence</li>
            </ul>
          </div>
          <div>
            <strong>Components:</strong> Presentation/Container pattern
            <ul className="ml-4 mt-1 text-gray-600">
              <li>• Presentation: Pure UI components with props</li>
              <li>• Container: Business logic with hooks and state</li>
              <li>• Form validation with Zod schemas</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};