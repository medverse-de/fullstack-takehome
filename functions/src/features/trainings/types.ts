export type TrainingStatus = "draft" | "published" | "archived";

export interface TrainingDoc {
  readonly id: string;
  readonly tenantId: string;
  readonly title: string;
  readonly description: string;
  readonly status: TrainingStatus;
  readonly order: number;
  readonly durationMinutes: number;
  readonly thumbnailUrl: string;
}

/** Shape returned to the portal and to the Unity clients. */
export interface TrainingSummary {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly durationMinutes: number;
  readonly thumbnailUrl: string;
}
