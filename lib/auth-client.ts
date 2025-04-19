import { createAuthClient } from "better-auth/client";
import { adminClient, usernameClient } from "better-auth/client/plugins";

import { env } from "@/env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [adminClient(), usernameClient()],
});
export const { signIn, signUp, updateUser, forgetPassword, resetPassword } =
  authClient;
