// Mock async actions for demo purposes

export interface MutationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MutationOptions {
  delay?: number;
  successRate?: number;
}

// Simulate network delay and potential failures
const simulateAsyncOperation = async (
  options: MutationOptions = {}
): Promise<void> => {
  const { delay = 2000, successRate = 0.8 } = options;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() > successRate) {
    throw new Error("Operation failed");
  }
};

// User Management Actions
export const deleteUserMutation = async (
  userId: string
): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 1500, successRate: 0.9 });
    return {
      success: true,
      data: { userId, deletedAt: new Date().toISOString() },
    };
  } catch {
    return {
      success: false,
      error: "Failed to delete user account",
    };
  }
};

export const logoutMutation = async (): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 1000, successRate: 0.95 });
    return {
      success: true,
      data: { loggedOutAt: new Date().toISOString() },
    };
  } catch {
    return {
      success: false,
      error: "Failed to logout",
    };
  }
};

// File Management Actions
export const uploadFilesMutation = async (
  files: string[]
): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 3000, successRate: 0.8 });
    return {
      success: true,
      data: {
        uploadedFiles: files.map((file) => ({
          name: file,
          id: Math.random().toString(36).substring(7),
          uploadedAt: new Date().toISOString(),
        })),
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to upload files",
    };
  }
};

// Payment Actions
export const processPaymentMutation = async (
  amount: number
): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 2500, successRate: 0.7 });
    return {
      success: true,
      data: {
        transactionId: Math.random().toString(36).substring(7),
        amount,
        processedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Payment processing failed",
    };
  }
};

// Database Actions
export const backupDatabaseMutation = async (): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 4000, successRate: 0.9 });
    return {
      success: true,
      data: {
        backupId: Math.random().toString(36).substring(7),
        backupSize: "2.3 GB",
        createdAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Database backup failed",
    };
  }
};

// Settings Actions
export const saveSettingsMutation = async (
  settings: Record<string, unknown>
): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 800, successRate: 0.95 });
    return {
      success: true,
      data: {
        settings,
        savedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to save settings",
    };
  }
};

// Batch Actions
export const clearCacheMutation = async (): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 1200, successRate: 0.9 });
    return {
      success: true,
      data: {
        clearedItems: Math.floor(Math.random() * 1000) + 100,
        clearedAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to clear cache",
    };
  }
};

export const resetSettingsMutation = async (): Promise<MutationResult> => {
  try {
    await simulateAsyncOperation({ delay: 1000, successRate: 0.9 });
    return {
      success: true,
      data: {
        resetAt: new Date().toISOString(),
      },
    };
  } catch {
    return {
      success: false,
      error: "Failed to reset settings",
    };
  }
};
