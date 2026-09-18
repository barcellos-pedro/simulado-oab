export const TIMER_DURATION_SECONDS = 5 * 60 * 60;
export const TIMER_RESET_EVENT = "oab:timer-reset";

const TIMER_KEYS = [
  "oab-timer-deadline",
  "oab-timer-started-at",
  "oab-timer-paused-at",
];

export function clearTimer() {
  TIMER_KEYS.forEach((key) => localStorage.removeItem(key));
}

export function resetTimer(now = Date.now()) {
  const deadline = now + TIMER_DURATION_SECONDS * 1000;

  localStorage.setItem("oab-timer-deadline", JSON.stringify(deadline));
  localStorage.setItem("oab-timer-started-at", JSON.stringify(now));
  localStorage.removeItem("oab-timer-paused-at");
  window.dispatchEvent(
    new CustomEvent(TIMER_RESET_EVENT, {
      detail: { startedAt: now, deadline },
    }),
  );

  return { startedAt: now, deadline };
}
