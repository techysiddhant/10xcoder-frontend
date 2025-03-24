"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Github, Mail } from "lucide-react";
import toast from "react-hot-toast";

import { signIn } from "@/lib/auth-client";

import { Button } from "../ui/button";

export const SocialSigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callback = searchParams.get("callbackUrl");
  const handleSocialSignUp = async (provider: string) => {
    setIsLoading(true);
    switch (provider) {
      case "Google":
        await signIn.social(
          {
            provider: "google",
            callbackURL: callback ? callback : "http://localhost:3000/",
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
        break;
      case "GitHub":
        await signIn.social(
          {
            provider: "github",
            callbackURL: callback ? callback : "http://localhost:3000/",
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
        break;
      default:
        console.error("Invalid provider");
        break;
    }
    setIsLoading(false);
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
