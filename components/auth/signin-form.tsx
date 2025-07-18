"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LogIn, Mail } from "lucide-react";
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
import { env } from "@/env";
import { signIn } from "@/lib/auth-client";
import { signInSchema } from "@/lib/schema";

type FormValues = z.infer<typeof signInSchema>;
export const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");
  const form = useForm<FormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: callback ? callback : env.NEXT_PUBLIC_URL,
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            setIsLoading(false);
            form.reset();
            toast.success("Logged in successfully");
          },
          onError: (ctx) => {
            setIsLoading(false);
            if (ctx.error.status === 403) {
              toast.error("Please verify your email address");
              return;
            }
            toast.error(ctx.error.message ?? "Something went wrong");
          },
        }
      );
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to connect to authentication service");
      console.error(error);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-primary text-sm font-medium dark:hover:text-yellow-300"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                  <Input
                    placeholder="Enter your password"
                    type="password"
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
              <span className="mr-2">Signing In...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
