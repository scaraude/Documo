import z from "zod";
import { createRequestSchema } from "./zod";

export type CreateRequestParams = z.infer<typeof createRequestSchema>;    