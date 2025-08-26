export const formatBytes = (bytes: number): string => {
  return bytes > 1_048_576
    ? `${(bytes / 1_048_576).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(2)} KB`;
};
