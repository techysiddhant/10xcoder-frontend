"use client";

import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle, CircleArrowLeft, Mail } from "lucide-react";
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
import { forgetPassword } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/lib/schema";

type FormValues = z.infer<typeof forgotPasswordSchema>;
export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    await forgetPassword(
      {
        email: data.email,
        redirectTo: "/",
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          setIsSubmitted(true);
        },
        onError: (ctx) => {
          setIsLoading(false);
          setIsSubmitted(false);
          toast.error(ctx.error.message ?? "Something went wrong");
        },
      }
    );
  };
  return (
    <>
      {!isSubmitted ? (
        <>
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Forgot Password</h1>
            <p className="text-muted-foreground">
              Enter your email to receive a password reset link
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="text-secondary dark:text-secondary-foreground w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Sending...</span>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </>
                ) : (
                  <>
                    <span>Send Reset Link</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 font-medium"
            >
              <CircleArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </div>
        </>
      ) : (
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold">Check Your Email</h2>
          <p className="text-muted-foreground">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium">{form.getValues().email}</span>
          </p>
          <p className="text-muted-foreground text-sm">
            If you don&apos;t see it, please check your spam folder
          </p>
          <div className="pt-4">
            <Link href="/signin">
              <Button variant="outline">Back to Sign In</Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
