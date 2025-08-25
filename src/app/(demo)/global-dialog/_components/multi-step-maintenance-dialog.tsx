'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';

interface MultiStepMaintenanceDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const MultiStepMaintenanceDialog = ({ onConfirm, isLoading }: MultiStepMaintenanceDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-purple-500" />
          Multi-Step with Loading
        </CardTitle>
        <CardDescription>
          Multi-step system maintenance with sequential async mutations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} variant="secondary" className="w-full" disabled={isLoading}>
          <Database className="h-4 w-4 mr-2" />
          {isLoading ? "Maintenance in progress..." : "Start Maintenance"}
        </Button>
      </CardContent>
    </Card>
  );
};