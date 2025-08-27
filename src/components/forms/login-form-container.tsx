"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoginMutation } from "@/hooks/use-auth-mutation";
import { LoginForm } from "./login-form";
import { type LoginFormData } from "@/lib/form-schemas";

export const LoginFormContainer = () => {
  const loginMutation = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success("Login successful! Redirecting...");
      router.push("/auth/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      isLoading={loginMutation.isPending}
    />
  );
};