import { cookies } from "next/headers";

/**
 * The portal stores the Firebase ID token in an httpOnly session cookie that is
 * set during the SSO / LTI launch. Assume it is always present for this exercise.
 */
export async function getIdToken(): Promise<string> {
  const store = await cookies();
  return store.get("mv_session")?.value ?? "";
}
