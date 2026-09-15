export interface TrainingSummary {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  thumbnailUrl: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5001/api";

export async function fetchTrainings(idToken: string): Promise<TrainingSummary[]> {
  const res = await fetch(`${API_BASE}/trainings?key=${process.env.NEXT_PUBLIC_MEDVERSE_API_KEY}`, {
    headers: { authorization: `Bearer ${idToken}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load trainings");
  const body = await res.json();
  return body.data;
}
