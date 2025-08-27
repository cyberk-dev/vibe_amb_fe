"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLogoutMutation, useUpdateProfileMutation } from "@/hooks/use-auth-mutation";

interface User {
  id: string;
  email: string;
  name: string;
}

interface UserProfileDisplayProps {
  user: User;
}

export const UserProfileDisplay = ({ user }: UserProfileDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);
  
  const logoutMutation = useLogoutMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleSaveProfile = () => {
    if (editName.trim() && editName !== user.name) {
      updateProfileMutation.mutate({ name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold">User Profile</h2>
        <Button 
          onClick={handleLogout} 
          variant="outline" 
          size="sm"
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            User ID
          </label>
          <p className="text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
            {user.id}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
            {user.email}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelEdit}
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <span className="text-sm text-gray-900">{user.name}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Store State Demo
          </h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Profile updates use <code>updateProfile</code> action</p>
            <p>• State is persisted to localStorage automatically</p>
            <p>• Logout clears all auth state and redirects</p>
          </div>
        </div>
      </div>
    </Card>
  );
};