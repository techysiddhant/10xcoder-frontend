import { createJiti } from "jiti";

// Create a helper function to load your env
(async () => {
  const jiti = createJiti(new URL(import.meta.url).pathname);
  await jiti.import("./env");
})();
//
// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  // images:{
  //   remotePatterns:[
  //     {
  //       hostname:"images.unsplash.com",
  //     }
  //   ]
  // }
  images:{
    remotePatterns:[
      {
        hostname:"images.unsplash.com",
        protocol:"https",
        port:"",
        pathname:"**"
      }
    ]
  },
  async rewrites(){
    return [
      {
        source:"/ingest/static/:path*",
        destination:"https://us-assets.i.posthog.com/static/:path*"
      },
      {
        source:"/ingest/:path*",
        destination:"https://us.i.posthog.com/:path*"
      },
      {
        source:"/ingest/decide",
        destination:"https://us.i.posthog.com/decide"
      }
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect:true
};

export default nextConfig;
