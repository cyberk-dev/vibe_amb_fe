"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRegisterMutation } from "@/hooks/use-auth-mutation";
import { RegisterForm } from "./register-form";
import { type RegisterFormData } from "@/lib/form-schemas";

export const RegisterFormContainer = () => {
  const registerMutation = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      // Extract name, email, password for the API call (confirmPassword is only for validation)
      const { name, email, password } = data;
      await registerMutation.mutateAsync({ name, email, password });
      toast.success("Registration successful! Redirecting...");
      router.push("/auth/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <RegisterForm
      onSubmit={handleSubmit}
      isLoading={registerMutation.isPending}
    />
  );
};