import type { AuthContext } from "../../core/auth.js";
import type { TrainingSummary } from "./types.js";

/**
 * Returns the trainings the caller is allowed to see.
 *
 * TODO(candidate): implement. See ASSIGNMENT.md Task 1.
 */
export async function listTrainings(auth: AuthContext): Promise<TrainingSummary[]> {
  throw new Error("not implemented");
}
