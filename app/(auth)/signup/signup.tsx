import Link from "next/link";
import React, { Suspense } from "react";

import { SignupForm } from "@/components/auth/signup-form";
import { SocialSigninForm } from "@/components/auth/social-signin-form";
import { cn } from "@/lib/utils";

export const SignUp = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an Account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Sign up to access the full features of no-name
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
        <SignupForm />
      </Suspense>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/signin" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
};
