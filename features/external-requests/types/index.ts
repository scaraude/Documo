import { AppDocument } from "../../../shared/types";

export type AppDocumentWithoutRequestId = Omit<AppDocument, 'requestId'>;