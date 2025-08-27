"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  name: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onBackToDemo: () => void;
  isLoggingOut?: boolean;
}

export const Dashboard = ({ user, onLogout, onBackToDemo, isLoggingOut = false }: DashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={onBackToDemo} disabled={isLoggingOut}>
            Back to Demo
          </Button>
          <Button variant="outline" onClick={onLogout} disabled={isLoggingOut}>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">ID:</label>
              <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                {user.id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email:</label>
              <p className="text-sm bg-gray-50 p-2 rounded mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Name:</label>
              <p className="text-sm bg-gray-50 p-2 rounded mt-1">{user.name}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">Authenticated</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>✅ Token validation successful</p>
              <p>✅ User session active</p>
              <p>✅ Protected route accessible</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Auth Store Features</h2>
          <div className="space-y-2 text-sm">
            <div className="p-2 bg-blue-50 rounded">
              <strong>Atomic Selectors:</strong> useUser(), useIsAuthenticated()
            </div>
            <div className="p-2 bg-green-50 rounded">
              <strong>Actions Namespace:</strong> login(), logout(), updateProfile()
            </div>
            <div className="p-2 bg-purple-50 rounded">
              <strong>Persistence:</strong> localStorage with migrations
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <strong>Type Safety:</strong> Full TypeScript integration
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Demo Features</h2>
          <div className="space-y-2 text-sm">
            <p>🔐 Login/Register forms with validation</p>
            <p>📊 Dashboard with protected routes</p>
            <p>👤 Profile management</p>
            <p>🔄 State persistence across sessions</p>
            <p>📱 Responsive design</p>
            <p>⚡ Zustand v5 with best practices</p>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Implementation Details</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">File Structure</h3>
            <div className="font-mono text-xs space-y-1 text-gray-600">
              <p>📁 src/stores/auth-store.ts</p>
              <p>📁 src/api/auth.ts</p>
              <p>📁 src/components/forms/</p>
              <p>📁 src/app/(demo)/auth/</p>
              <p>📁 src/lib/form-schemas.ts</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Architecture Patterns</h3>
            <div className="space-y-1 text-gray-600">
              <p>• Presentation/Container separation</p>
              <p>• Atomic state selectors</p>
              <p>• Event-based actions</p>
              <p>• Form validation with Zod</p>
              <p>• Protected route guards</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};