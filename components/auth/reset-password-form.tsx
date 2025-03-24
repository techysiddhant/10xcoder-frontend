"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/schema";

type FormValues = z.infer<typeof resetPasswordSchema>;
export const ResetPasswordForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  if (!token) {
    return (
      <>
        <div className="container mx-auto max-w-md px-4 pt-24 pb-16 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-red-500">
              Invalid Reset Link
            </h1>
            <p>This password reset link is invalid or has expired.</p>
            <Link href="/forgot-password">
              <Button>Request a new link</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    const { error } = await resetPassword({
      token,
      newPassword: data.password,
    });
    if (error) {
      toast.error(error.message ?? "Something went wrong.");
    } else {
      form.reset();
      setIsLoading(false);
      setIsSubmitted(true);
      toast.success("Password reset successfully. Please sign in.");
      router.push("/signin");
    }
  };
  return (
    <>
      {!isSubmitted ? (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
            <p className="text-muted-foreground">
              Create a new password for your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-2.5 left-3 size-5" />
                        <Input
                          placeholder="Enter your new password"
                          type={showPassword ? "text" : "password"}
                          className="pr-10 pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 size-9"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    <div className="text-muted-foreground mt-1 text-xs">
                      Password must be at least 8 characters with uppercase,
                      lowercase and numbers.
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="text-muted-foreground absolute top-2.5 left-3 size-5" />
                        <Input
                          placeholder="Confirm your new password"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pr-10 pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground absolute top-0 right-0 size-9"
                          onClick={toggleConfirmPasswordVisibility}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2">Resetting Password...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm">
            <Link
              href="/signin"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Password Reset Successfully!</h2>
          <p className="text-muted-foreground">
            Your password has been updated. You will be redirected to the
            sign-in page shortly.
          </p>
          <div className="pt-4">
            <Link href="/signin">
              <Button>Go to Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
