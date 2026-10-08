/** Fenêtre fixe de limitation de débit. Pure : la persistance est faite par l'appelant. */

export type WindowState = { count: number; windowStart: Date };

export type RateDecision = {
  allowed: boolean;
  next: WindowState;
  retryAfterSeconds: number;
};

export function decideRate(state: WindowState | null, now: Date, limit: number, windowMs: number): RateDecision {
  const expired = !state || now.getTime() - state.windowStart.getTime() >= windowMs;
  const current: WindowState = expired ? { count: 0, windowStart: now } : state;

  if (current.count >= limit) {
    const remainingMs = windowMs - (now.getTime() - current.windowStart.getTime());
    return { allowed: false, next: current, retryAfterSeconds: Math.max(1, Math.ceil(remainingMs / 1000)) };
  }
  return {
    allowed: true,
    next: { count: current.count + 1, windowStart: current.windowStart },
    retryAfterSeconds: 0,
  };
}
