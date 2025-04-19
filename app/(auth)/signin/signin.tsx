"use client";

import Link from "next/link";
import { Suspense } from "react";

import { SigninForm } from "@/components/auth/signin-form";
import { SocialSigninForm } from "@/components/auth/social-signin-form";
import { cn } from "@/lib/utils";

export const SignIn = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign In to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign In with your Github or Google account
        </p>
      </div>
      <div className="space-y-4">
        <Suspense>
          <SocialSigninForm />
        </Suspense>
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or continue with
        </span>
      </div>
      <Suspense>
        <SigninForm />
      </Suspense>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
};
