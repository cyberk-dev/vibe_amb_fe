"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { TypographyBase, TypographyMD } from "@/shared/ui/typography";
import { useLoginMutation } from "@/features/login";
import { useGoogleLogin } from "@/hooks/auth/use-google-login";

// Login validation schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginContainerProps {
  onSuccess?: () => void;
}

export const LoginContainer = ({ onSuccess }: LoginContainerProps) => {
  const loginMutation = useLoginMutation();
  const { handleGoogleLogin, isLoading: isGoogleLoading } = useGoogleLogin({ onSuccess });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation.mutateAsync({ username: data.email, password: data.password });
      loginForm.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const isLoading = loginMutation.isPending || isGoogleLoading;

  return (
    <div className="space-y-4">
      {/* Google Login Button */}
      <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        <TypographyMD variant="medium">
          {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
        </TypographyMD>
      </Button>

      {/* Separator */}
      <div className="relative">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-card px-2">
            <TypographyBase className="text-muted-foreground text-sm">or continue with email</TypographyBase>
          </span>
        </div>
      </div>

      {/* Email/Password Form */}
      <Form {...loginForm}>
        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
          <FormField
            control={loginForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <TypographyBase variant="medium">Email</TypographyBase>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} disabled={loginMutation.isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={loginForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <TypographyBase variant="medium">Password</TypographyBase>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={loginMutation.isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            <TypographyMD variant="medium">{loginMutation.isPending ? "Logging in..." : "Log In"}</TypographyMD>
          </Button>
        </form>
      </Form>
    </div>
  );
};
