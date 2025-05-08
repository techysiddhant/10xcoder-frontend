"use client";

import { useRouter } from "next/navigation";

import BookmarksMain from "@/components/bookmarks/bookmarks-main";
import { useSession } from "@/hooks/use-session";

const Bookmarks = () => {
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
    <div className="container mx-auto px-4 pb-16">
      <BookmarksMain />
    </div>
  );
};

export default Bookmarks;
