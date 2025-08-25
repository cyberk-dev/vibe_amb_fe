'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface DestructiveActionDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const DestructiveActionDialog = ({ onConfirm, isLoading }: DestructiveActionDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Destructive Action
        </CardTitle>
        <CardDescription>
          Destructive async mutation with proper error handling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} variant="destructive" className="w-full" disabled={isLoading}>
          <Trash2 className="h-4 w-4 mr-2" />
          {isLoading ? "Deleting..." : "Delete Account"}
        </Button>
      </CardContent>
    </Card>
  );
};