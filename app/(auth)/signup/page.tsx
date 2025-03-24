import Link from "next/link";

import { SignupForm } from "@/components/auth/signup-form";
import { SocialSigninForm } from "@/components/auth/social-signin-form";

const SignUpPage = () => {
  return (
    <section className="container mx-auto max-w-md px-4 pt-24 pb-16">
      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-sm drop-shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">
            Sign up to access the full features of no-name
          </p>
        </div>
        <div className="space-y-4">
          <SocialSigninForm />
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
          <SignupForm />
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="font-medium text-blue-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpPage;
