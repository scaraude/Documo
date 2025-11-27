interface ShareLinkParams {
  params: { id: string };
}

interface ShareLinkResponse {
  token: string;
}

interface ErrorResponse {
  error: string;
}

export interface CreateShareLinkParams {
  requestId: string;
  expiresAt: Date;
}
