export function computeWpm(correctChars: number, sessionStartedAt: number | null, now: number): number {
  if (!sessionStartedAt || correctChars === 0) return 0;
  const minutes = (now - sessionStartedAt) / 60_000;
  if (minutes <= 0) return 0;
  return Math.round(correctChars / 5 / minutes);
}

export function computeCpm(correctChars: number, sessionStartedAt: number | null, now: number): number {
  if (!sessionStartedAt || correctChars === 0) return 0;
  const minutes = (now - sessionStartedAt) / 60_000;
  if (minutes <= 0) return 0;
  return Math.round(correctChars / minutes);
}

export function computeAccuracy(correct: number, incorrect: number): number {
  const total = correct + incorrect;
  if (total === 0) return 100;
  return Math.round((correct / total) * 1000) / 10;
}
