import type { Request, Response } from "express";
import { requireAuth } from "../../core/auth.js";
import { listTrainings } from "./service.js";

export async function trainingsHandler(req: Request, res: Response) {
  try {
    const auth = await requireAuth(req);

    const tenantId = (req.query.tenantId as string) || auth.tenantId;

    const trainings = await listTrainings({ ...auth, tenantId });

    res.set("Access-Control-Allow-Origin", "*");
    res.status(200).json({ data: trainings, error: null, status: 200 });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ data: null, error: err.message, status: 500 });
  }
}
