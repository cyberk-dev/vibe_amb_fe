"use client";

import { toast } from "sonner";
import { useConfirmDialog } from "@/lib/hooks/use-confirm-dialog";
import {
  useSaveSettingsMutation,
  useDeleteUserMutation,
  useUploadFilesMutation,
  useLogoutMutation,
  useProcessPaymentMutation,
  useBackupDatabaseMutation,
  useClearCacheMutation,
  useResetSettingsMutation,
} from "@/lib/hooks/use-mutations";
import { BasicConfirmDialog } from "./basic-confirm-dialog";
import { DestructiveActionDialog } from "./destructive-action-dialog";
import { CustomUploadDialog } from "./custom-upload-dialog";
import { AsyncLogoutDialog } from "./async-logout-dialog";
import { PaymentProcessingDialog } from "./payment-processing-dialog";
import { MultiStepMaintenanceDialog } from "./multi-step-maintenance-dialog";

export const ConfirmDialogExamplesContainer = () => {
  const { showConfirm } = useConfirmDialog();

  const saveSettingsMutation = useSaveSettingsMutation();
  const deleteUserMutation = useDeleteUserMutation();
  const uploadFilesMutation = useUploadFilesMutation();
  const logoutMutation = useLogoutMutation();
  const processPaymentMutation = useProcessPaymentMutation();
  const backupDatabaseMutation = useBackupDatabaseMutation();
  const clearCacheMutation = useClearCacheMutation();
  const resetSettingsMutation = useResetSettingsMutation();

  const handleBasicConfirm = async () => {
    const result = await showConfirm({
      title: "Save Changes",
      description: "Are you sure you want to save your changes?",
    });

    if (result) {
      try {
        const mutationResult = await saveSettingsMutation.mutateAsync({
          theme: "dark",
          notifications: true,
          autoSave: true,
        });

        if (mutationResult.success) {
          toast.success("Settings saved successfully!", {
            description: `Saved at ${mutationResult.data?.savedAt}`,
          });
        } else {
          toast.error("Save failed", {
            description: mutationResult.error,
          });
        }
      } catch {
        toast.error("Save operation failed unexpectedly");
      }
    } else {
      toast.info("Save cancelled by user");
    }
  };

  const handleDestructiveConfirm = async () => {
    const result = await showConfirm({
      title: "Delete Account",
      description:
        "This action cannot be undone. This will permanently delete your account and remove all data.",
      confirmText: "Delete Account",
      cancelText: "Keep Account",
      variant: "destructive",
    });

    if (result) {
      try {
        const mutationResult = await deleteUserMutation.mutateAsync("user-123");

        if (mutationResult.success) {
          toast.success("Account deleted successfully!", {
            description: `User ID: ${mutationResult.data?.userId}`,
          });
        } else {
          toast.error("Account deletion failed", {
            description: mutationResult.error,
          });
        }
      } catch {
        toast.error("Account deletion failed unexpectedly");
      }
    } else {
      toast.info("Account deletion cancelled - account preserved");
    }
  };

  const handleCustomConfirm = async () => {
    const result = await showConfirm({
      title: "Upload Files",
      description:
        "You are about to upload 5 files. This will overwrite any existing files with the same names.",
      confirmText: "Upload Files",
      cancelText: "Cancel Upload",
      variant: "default",
    });

    if (result) {
      try {
        const files = [
          "document.pdf",
          "image.jpg",
          "data.csv",
          "presentation.pptx",
          "report.docx",
        ];
        const mutationResult = await uploadFilesMutation.mutateAsync(files);

        if (mutationResult.success) {
          const fileCount = mutationResult.data?.uploadedFiles?.length || 0;
          toast.success(`Successfully uploaded ${fileCount} files!`, {
            description: "All files have been processed",
          });
        } else {
          toast.error("File upload failed", {
            description: mutationResult.error,
          });
        }
      } catch {
        toast.error("File upload failed unexpectedly");
      }
    } else {
      toast.info("File upload cancelled - no files uploaded");
    }
  };

  const handleAsyncActionConfirm = async () => {
    const result = await showConfirm({
      title: "Logout Confirmation",
      description:
        "Are you sure you want to logout? Any unsaved work will be lost.",
      confirmText: "Logout",
      cancelText: "Stay Logged In",
    });

    if (result) {
      try {
        const mutationResult = await logoutMutation.mutateAsync();

        if (mutationResult.success) {
          toast.success("Logged out successfully!", {
            description: `Session ended at ${mutationResult.data?.loggedOutAt}`,
          });
        } else {
          toast.error("Logout failed", {
            description: mutationResult.error,
          });
        }
      } catch {
        toast.error("Logout failed unexpectedly");
      }
    } else {
      toast.info("Logout cancelled - staying logged in");
    }
  };

  const handleLoadingConfirm = async () => {
    const result = await showConfirm({
      title: "Process Payment",
      description: "This will charge your card $29.99. Continue?",
      confirmText: "Process Payment",
      cancelText: "Cancel",
      variant: "destructive",
    });

    if (result) {
      try {
        const mutationResult = await processPaymentMutation.mutateAsync(29.99);

        if (mutationResult.success) {
          toast.success("Payment processed successfully!", {
            description: `Transaction ID: ${mutationResult.data?.transactionId} - Amount: $${mutationResult.data?.amount}`,
          });
        } else {
          toast.error("Payment failed", {
            description: mutationResult.error,
          });
        }
      } catch {
        toast.error("Payment processing failed unexpectedly");
      }
    } else {
      toast.info("Payment cancelled - no charges applied");
    }
  };

  const handleMultiStepWithLoading = async () => {
    // Step 1: Initial confirmation
    const step1Result = await showConfirm({
      title: "System Maintenance",
      description:
        "This will perform database backup, clear cache, and reset temporary settings. Continue?",
      confirmText: "Start Maintenance",
      cancelText: "Cancel",
    });

    if (!step1Result) {
      toast.info("System maintenance cancelled");
      return;
    }

    const results: string[] = [];

    try {
      // Step 2: Database backup
      toast.info("Step 1/3: Creating database backup...");

      const backupResult = await backupDatabaseMutation.mutateAsync();
      if (backupResult.success) {
        results.push(
          `✓ Database backup created (${backupResult.data?.backupSize})`
        );
        toast.success("Database backup completed");
      } else {
        throw new Error(`Backup failed: ${backupResult.error}`);
      }

      // Step 3: Clear cache
      toast.info("Step 2/3: Clearing cache...");

      const cacheResult = await clearCacheMutation.mutateAsync();
      if (cacheResult.success) {
        results.push(
          `✓ Cache cleared (${cacheResult.data?.clearedItems} items)`
        );
        toast.success("Cache cleared successfully");
      } else {
        throw new Error(`Cache clear failed: ${cacheResult.error}`);
      }

      // Step 4: Reset settings
      toast.info("Step 3/3: Resetting temporary settings...");

      const resetResult = await resetSettingsMutation.mutateAsync();
      if (resetResult.success) {
        results.push(`✓ Settings reset completed`);
        toast.success("Settings reset completed");
      } else {
        throw new Error(`Settings reset failed: ${resetResult.error}`);
      }

      // Final confirmation
      const finalResult = await showConfirm({
        title: "Maintenance Complete",
        description: `All maintenance tasks completed successfully:\n\n${results.join(
          "\n"
        )}\n\nWould you like to restart the application?`,
        confirmText: "Restart Now",
        cancelText: "Later",
      });

      if (finalResult) {
        toast.success("Maintenance completed - Application restart initiated", {
          description: "All maintenance tasks completed successfully",
        });
      } else {
        toast.success("Maintenance completed", {
          description: "Manual restart required later",
        });
      }
    } catch (error) {
      toast.error("Maintenance failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="space-y-6">
      <BasicConfirmDialog
        onConfirm={handleBasicConfirm}
        isLoading={saveSettingsMutation.isPending}
      />
      <DestructiveActionDialog
        onConfirm={handleDestructiveConfirm}
        isLoading={deleteUserMutation.isPending}
      />
      <CustomUploadDialog
        onConfirm={handleCustomConfirm}
        isLoading={uploadFilesMutation.isPending}
      />
      <AsyncLogoutDialog
        onConfirm={handleAsyncActionConfirm}
        isLoading={logoutMutation.isPending}
      />
      <PaymentProcessingDialog
        onConfirm={handleLoadingConfirm}
        isLoading={processPaymentMutation.isPending}
      />
      <MultiStepMaintenanceDialog
        onConfirm={handleMultiStepWithLoading}
        isLoading={
          backupDatabaseMutation.isPending ||
          clearCacheMutation.isPending ||
          resetSettingsMutation.isPending
        }
      />
    </div>
  );
};
