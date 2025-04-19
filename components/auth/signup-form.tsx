"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Check, Lock, Mail, User } from "lucide-react";
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
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/schema";

type FormValues = z.infer<typeof signUpSchema>;
export const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    await signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.name,
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          setIsSuccess(true);
          setIsLoading(false);
          form.reset();
          toast.success(
            "Account created successfully, please check your email to verify your account"
          );
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message ?? "Something went wrong");
        },
      }
    );
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                  <Input
                    placeholder="Enter your name"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                  <Input
                    placeholder="Create a password"
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
          variant={"default"}
          className="text-secondary dark:text-secondary-foreground w-full"
          disabled={isLoading || isSuccess}
        >
          {isLoading ? (
            <>
              <span className="mr-2">Creating Account...</span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            </>
          ) : isSuccess ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Account Created
            </>
          ) : (
            <>
              Sign Up
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};
