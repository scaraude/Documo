export interface ShareLinkParams {
  params: { id: string };
}

export interface ShareLinkResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
}

export interface CreateShareLinkParams {
  requestId: string;
  token: string;
  expiresAt: Date;
}
