import z from "zod";
import { createRequestSchema } from "./zod";

export type createRequestParams = z.infer<typeof createRequestSchema>;    