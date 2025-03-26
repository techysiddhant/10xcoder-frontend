import React from "react";

import { Navbar } from "@/components/navbar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="pt-32 md:pt-36">{children}</main>
    </>
  );
};

export default RootLayout;
