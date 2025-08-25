'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';

interface AsyncLogoutDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const AsyncLogoutDialog = ({ onConfirm, isLoading }: AsyncLogoutDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="h-5 w-5 text-orange-500" />
          Async Action
        </CardTitle>
        <CardDescription>
          Session management with logout mutation and cleanup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} variant="outline" className="w-full" disabled={isLoading}>
          <LogOut className="h-4 w-4 mr-2" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </CardContent>
    </Card>
  );
};