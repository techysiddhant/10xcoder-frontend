"use client";

import { useRouter } from "next/navigation";
import { Suspense } from "react";

import { SubmitMain } from "@/components/submit/submit-main";
import { useSession } from "@/hooks/use-session";

const ResourceSubmitPage = () => {
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
    router.push("/signin?callbackUrl=/submit");
  }
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 pb-16">Loading...</div>}
    >
      <SubmitMain />
    </Suspense>
  );
};

export default ResourceSubmitPage;
