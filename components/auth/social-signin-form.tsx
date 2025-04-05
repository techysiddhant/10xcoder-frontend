"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Github, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { env } from "@/env";
import { useSession } from "@/hooks/use-session";
import { signIn } from "@/lib/auth-client";

import { Button } from "../ui/button";

export const SocialSigninForm = () => {
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callback = searchParams.get("callbackUrl");
  if (session && session.user) {
    router.push(callback ? callback : "/");
    return null;
  }
  const handleSocialSignUp = async (provider: string) => {
    try {
      setIsLoading(true);
      const providerMap: Record<string, "google" | "github"> = {
        Google: "google",
        GitHub: "github",
      };

      const providerKey = providerMap[provider];
      if (!providerKey) {
        console.error("Invalid provider");
        return;
      }

      await signIn.social(
        {
          provider: providerKey,
          callbackURL: callback
            ? `${env.NEXT_PUBLIC_URL}${callback}`
            : env.NEXT_PUBLIC_URL,
        },
        {
          onSuccess: () => {
            toast.success("Logged in successfully");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message ?? "Something went wrong.");
          },
        }
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to authentication service");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialSignUp("Google")}
        disabled={isLoading}
      >
        <Mail className="mr-2 h-4 w-4" />
        Google
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => handleSocialSignUp("GitHub")}
        disabled={isLoading}
      >
        <Github className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
};
