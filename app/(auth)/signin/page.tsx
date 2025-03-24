import Link from "next/link";

import { SigninForm } from "@/components/auth/signin-form";
import { SocialSigninForm } from "@/components/auth/social-signin-form";

const SignInPage = () => {
  return (
    <section className="container mx-auto max-w-md px-4 pt-24 pb-16">
      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-sm drop-shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to your no-name account
          </p>
        </div>
        <div className="space-y-4">
          <SocialSigninForm />
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>
        <SigninForm />
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
