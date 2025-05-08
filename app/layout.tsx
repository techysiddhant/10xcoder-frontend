import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import { Toaster } from "react-hot-toast";

import { PostHogProvider } from "@/components/providers/posthog-provider";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "10xCoder.club",
    template: "%s | 10xCoder.club",
  },
  description:
    "Discover and share the best free developer resources on 10xcoder.club — curated tools, articles, and videos to boost your coding journey.",
  openGraph: {
    title: "10xCoder.club",
    description:
      "Discover and share the best free developer resources on 10xcoder.club — curated tools, articles, and videos to boost your coding journey.",
    url: "https://10xcoder.club",
    siteName: "10xCoder.club",
    type: "website",
    images: [
      {
        url: "https://10xcoder.club/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "10xCoder.club",
      },
    ],
  },
  metadataBase: new URL("https://10xcoder.club"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="10xcoder.club" />
      </head>
      <body className={`${poppins.variable} ${inter.variable} antialiased`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 5000,
                  removeDelay: 1000,
                }}
              />
            </ReactQueryProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
