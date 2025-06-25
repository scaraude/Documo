'use client';

import { trpc } from '../../../lib/trpc/client';

export const useExternalRequest = () => {
  const getRequestByToken = (token: string) =>
    trpc.external.getRequestByToken.useQuery({ token });

  const generateShareLink = trpc.external.generateShareLink.useMutation();
  const acceptRequest = trpc.external.acceptRequest.useMutation();
  const declineRequest = trpc.external.declineRequest.useMutation();

  return {
    generateShareLink,
    getRequestByToken,
    acceptRequest,
    declineRequest,
  };
};
