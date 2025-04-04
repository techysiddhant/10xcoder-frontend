"use client";

import { redirect } from "next/navigation";

import { SubmitMain } from "@/components/submit/submit-main";
import { useSession } from "@/hooks/use-session";

const ResourceSubmitPage = () => {
  const { data: session } = useSession();
  if (!session || !session.user) {
    redirect("/signin?callbackUrl=/submit");
  }
  return <SubmitMain />;
};

export default ResourceSubmitPage;
