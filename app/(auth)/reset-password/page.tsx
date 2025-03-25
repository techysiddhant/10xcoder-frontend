import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";

const ResetPasswordPage = () => {
  return (
    <section className="container mx-auto max-w-md px-4 pt-24 pb-16">
      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-md">
        <Suspense>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
