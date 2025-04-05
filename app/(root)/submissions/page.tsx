"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { SubmissionsMain } from "@/components/submissions/submissions-main";
import { useSession } from "@/hooks/use-session";

const SubmissionPage = () => {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  if (isPending) {
    return (
      <div className="container mx-auto px-4 pb-16">
        <h1 className="font-display mb-4 text-4xl font-bold md:text-5xl">
          Loading...
        </h1>
      </div>
    );
  }
  if (!session || !session.user) {
    router.push("/signin?callbackUrl=/submissions");
    return null;
  }
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 pb-16">Loading...</div>}
    >
      <SubmissionsMain />
    </Suspense>
  );
};

export default SubmissionPage;
