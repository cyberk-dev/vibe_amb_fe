'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle } from 'lucide-react';

interface ResultDisplayProps {
  lastResult: string | null;
}

export const ResultDisplay = ({ lastResult }: ResultDisplayProps) => {
  if (!lastResult) return null;

  const isSimpleResult = lastResult === 'confirmed' || lastResult === 'cancelled';

  return (
    <>
      <Separator />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Last Result</CardTitle>
        </CardHeader>
        <CardContent>
          {isSimpleResult ? (
            <div className="flex items-center gap-2">
              {lastResult === 'confirmed' ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Confirmed
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    Cancelled
                  </Badge>
                </>
              )}
              <span className="text-sm text-muted-foreground ml-2">
                User {lastResult} the action
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                Operation Result:
              </div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {lastResult}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};