import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, beforeEach, describe, it } from "vitest";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

let env: RulesTestEnvironment;

const ALICE = { sub: "alice", tenantId: "hospital-a", role: "user" };
const BOB = { sub: "bob", tenantId: "hospital-a", role: "user" };
const DAN_OTHER_TENANT = { sub: "dan", tenantId: "hospital-b", role: "user" };

function session(userId: string, tenantId: string) {
  return { tenantId, userId, trainingId: "t1", progress: 0, score: 0, updatedAt: 1 };
}

function db(user: Record<string, unknown>) {
  const { sub, ...claims } = user;
  return env.authenticatedContext(sub as string, claims).firestore();
}

beforeAll(async () => {
  env = await initializeTestEnvironment({
    projectId: "medverse-takehome",
    firestore: { rules: readFileSync("../firestore.rules", "utf8"), host: "127.0.0.1", port: 8080 },
  });
});

afterAll(async () => env?.cleanup());

beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const raw = ctx.firestore();
    await setDoc(doc(raw, "sessions/s-alice"), session("alice", "hospital-a"));
    await setDoc(doc(raw, "sessions/s-dan"), session("dan", "hospital-b"));
  });
});

describe("sessions rules", () => {
  it("read_ownSession_isAllowed", async () => {
    await assertSucceeds(getDoc(doc(db(ALICE), "sessions/s-alice")));
  });

  it("update_ownProgress_isAllowed", async () => {
    await assertSucceeds(updateDoc(doc(db(ALICE), "sessions/s-alice"), { progress: 42 }));
  });

  it("read_sessionOfAnotherUser_isDenied", async () => {
    await assertFails(getDoc(doc(db(BOB), "sessions/s-alice")));
  });

  it("read_sessionOfAnotherTenant_isDenied", async () => {
    await assertFails(getDoc(doc(db(ALICE), "sessions/s-dan")));
  });

  it("update_score_isDenied", async () => {
    await assertFails(updateDoc(doc(db(ALICE), "sessions/s-alice"), { score: 100 }));
  });

  it("read_ownSessionAsUserOfOtherTenant_isAllowed", async () => {
    await assertSucceeds(getDoc(doc(db(DAN_OTHER_TENANT), "sessions/s-dan")));
  });
});
