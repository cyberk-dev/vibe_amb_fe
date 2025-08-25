'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface PaymentProcessingDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const PaymentProcessingDialog = ({ onConfirm, isLoading }: PaymentProcessingDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-green-500" />
          Loading State Demo
        </CardTitle>
        <CardDescription>
          Payment processing mutation with transaction handling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} variant="default" className="w-full" disabled={isLoading}>
          <CreditCard className="h-4 w-4 mr-2" />
          {isLoading ? "Processing..." : "Process Payment"}
        </Button>
      </CardContent>
    </Card>
  );
};