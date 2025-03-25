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
};

export default nextConfig;