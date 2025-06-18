export const useEmailMasking = () => {
  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    if (localPart.length <= 6) {
      return `${localPart[0]}***@${domain}`;
    }
    return `${localPart.slice(0, 6)}***@${domain}`;
  };

  return { maskEmail };
};
