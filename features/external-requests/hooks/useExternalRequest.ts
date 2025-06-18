'use client';

import { trpc } from '../../../lib/trpc/client';

export const useExternalRequest = () => {
  const getRequestByToken = (token: string) =>
    trpc.external.getRequestByToken.useQuery({ token });

  const generateShareLink = trpc.external.generateShareLink.useMutation();

  return {
    generateShareLink,
    getRequestByToken,
  };
};
