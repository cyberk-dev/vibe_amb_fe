'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, Save } from 'lucide-react';

interface BasicConfirmDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const BasicConfirmDialog = ({ onConfirm, isLoading }: BasicConfirmDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          Basic Confirm Dialog
        </CardTitle>
        <CardDescription>
          Basic async mutation with loading state and error handling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} className="w-full" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};