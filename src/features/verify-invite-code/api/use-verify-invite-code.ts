import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/shared/api";

export interface VerifyInviteCodeRequest {
  otpCode: string;
}

export interface VerifyInviteCodeResponse {
  otpToken: string;
  expiresInSec: number;
}

export interface VerifyInviteCodeError {
  message: string;
  code?: string;
}

/**
 * Mutation hook for verifying invite code
 * Endpoint: POST /lobby/verify-otp
 *
 * @see docs/lobby/lobby.md for API specification
 */
export function useVerifyInviteCode() {
  return useMutation<VerifyInviteCodeResponse, VerifyInviteCodeError, VerifyInviteCodeRequest>({
    mutationFn: async (data: VerifyInviteCodeRequest) => {
      const response = await apiClient.post<VerifyInviteCodeResponse>("/lobby/verify-otp", data);
      return response.data;
    },
  });
}
