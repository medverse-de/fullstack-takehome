import { onRequest } from "firebase-functions/v2/https";
import { trainingsHandler } from "./features/trainings/handler";
import "./runtime";

export const trainings = onRequest({ region: "europe-west3" }, trainingsHandler);
