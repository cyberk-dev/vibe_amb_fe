'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

interface CustomUploadDialogProps {
  onConfirm: () => void;
  isLoading?: boolean;
}

export const CustomUploadDialog = ({ onConfirm, isLoading }: CustomUploadDialogProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          Custom Dialog
        </CardTitle>
        <CardDescription>
          File upload mutation with progress tracking and batch operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onConfirm} variant="secondary" className="w-full" disabled={isLoading}>
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "Uploading..." : "Upload Files"}
        </Button>
      </CardContent>
    </Card>
  );
};