import { useMutation } from '@tanstack/react-query';
import {
  deleteUserMutation,
  logoutMutation,
  uploadFilesMutation,
  processPaymentMutation,
  backupDatabaseMutation,
  saveSettingsMutation,
  clearCacheMutation,
  resetSettingsMutation,
  MutationResult,
} from '@/lib/mocks/async-actions';

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => deleteUserMutation(userId),
    mutationKey: ['deleteUser'],
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => logoutMutation(),
    mutationKey: ['logout'],
  });
};

export const useUploadFilesMutation = () => {
  return useMutation({
    mutationFn: (files: string[]) => uploadFilesMutation(files),
    mutationKey: ['uploadFiles'],
  });
};

export const useProcessPaymentMutation = () => {
  return useMutation({
    mutationFn: (amount: number) => processPaymentMutation(amount),
    mutationKey: ['processPayment'],
  });
};

export const useBackupDatabaseMutation = () => {
  return useMutation({
    mutationFn: () => backupDatabaseMutation(),
    mutationKey: ['backupDatabase'],
  });
};

export const useSaveSettingsMutation = () => {
  return useMutation({
    mutationFn: (settings: Record<string, unknown>) => saveSettingsMutation(settings),
    mutationKey: ['saveSettings'],
  });
};

export const useClearCacheMutation = () => {
  return useMutation({
    mutationFn: () => clearCacheMutation(),
    mutationKey: ['clearCache'],
  });
};

export const useResetSettingsMutation = () => {
  return useMutation({
    mutationFn: () => resetSettingsMutation(),
    mutationKey: ['resetSettings'],
  });
};

export type { MutationResult };