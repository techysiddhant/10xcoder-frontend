import { createAuthClient } from "better-auth/client";
import { adminClient, usernameClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: "http://localhost:8787",
  plugins: [adminClient(), usernameClient()],
});
export const {
  signIn,
  signUp,
  useSession,
  updateUser,
  forgetPassword,
  resetPassword,
} = authClient;
