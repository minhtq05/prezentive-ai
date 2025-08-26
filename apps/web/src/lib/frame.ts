export const PIXELS_PER_SECOND = 100;

export const getFrameFromX = (
  clientX: number,
  durationInSeconds: number,
  fps: number
) => {
  return Math.min(
    durationInSeconds * fps,
    Math.max(0, Math.round(clientX / PIXELS_PER_SECOND / (1 / fps)))
  );
};
