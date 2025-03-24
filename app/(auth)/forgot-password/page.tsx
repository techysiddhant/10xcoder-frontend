import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

const ForgotPasswordPage = () => {
  return (
    <section className="container mx-auto max-w-md px-4 pt-24 pb-16">
      <div className="bg-card space-y-6 rounded-lg border p-6 shadow-md">
        <ForgotPasswordForm />
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
