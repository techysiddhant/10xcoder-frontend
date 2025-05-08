import React from "react";

import { Navbar } from "@/components/navbar";
import { PostHogProvider } from "@/components/providers/posthog-provider";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PostHogProvider>
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-200 to-orange-400 opacity-25 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          ></div>
        </div>
        <div
          aria-hidden
          className="absolute inset-x-0 top-20 transform-gpu overflow-hidden blur-3xl"
        >
          <div
            className="relative left-[calc(50%-13rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-amber-300 to-orange-500 opacity-25 sm:left-[calc(50%-36rem)] sm:w-[72.1875rem] dark:hidden"
            style={{
              clipPath:
                "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
            }}
          ></div>
          {/* <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-amber-300 to-orange-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          /> */}
        </div>
      </div>

      <Navbar />
      <main className="pt-32 md:pt-36">{children}</main>
    </PostHogProvider>
  );
};

export default RootLayout;
