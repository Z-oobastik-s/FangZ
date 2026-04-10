export function pulseError(strikes: number): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  if (strikes === 1) navigator.vibrate(18);
  else if (strikes === 2) navigator.vibrate([12, 28, 16]);
}

export function pulseTerminate(): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  navigator.vibrate([30, 40, 50, 60]);
}
