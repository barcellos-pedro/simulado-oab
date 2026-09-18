import { useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {
  clearTimer,
  resetTimer,
  TIMER_DURATION_SECONDS,
  TIMER_RESET_EVENT,
} from "../utils/timer";

export default function Timer({ active, paused }) {
  const [deadline, setDeadline] = useLocalStorage("oab-timer-deadline", null);
  const [startedAt, setStartedAt] = useLocalStorage(
    "oab-timer-started-at",
    null,
  );
  const [remaining, setRemaining] = useState(TIMER_DURATION_SECONDS);
  const [minimized, setMinimized] = useState(false);
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (!active) {
      clearTimer();
      setDeadline(null);
      setStartedAt(null);
    } else if (!deadline) {
      const now = Date.now();
      const timer = resetTimer(now);
      setDeadline(timer.deadline);
      setStartedAt(timer.startedAt);
    }
  }, [active, deadline, setDeadline, setStartedAt]);
  useEffect(() => {
    if (!active) return;
    const pausedAt = localStorage.getItem("oab-timer-paused-at");
    if (paused && !pausedAt) {
      localStorage.setItem("oab-timer-paused-at", String(Date.now()));
    } else if (!paused && pausedAt && deadline) {
      const resumedDeadline =
        deadline + Math.max(0, Date.now() - Number(pausedAt));
      setDeadline(resumedDeadline);
      localStorage.removeItem("oab-timer-paused-at");
    }
  }, [active, paused, deadline, setDeadline]);
  useEffect(() => {
    if (!active || paused || !deadline) return;
    const update = () =>
      setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000)));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [active, paused, deadline]);
  useEffect(() => {
    const reset = (event) => {
      setRemaining(TIMER_DURATION_SECONDS);
      setDeadline(event.detail.deadline);
    };
    window.addEventListener(TIMER_RESET_EVENT, reset);
    return () => window.removeEventListener(TIMER_RESET_EVENT, reset);
  }, [setDeadline]);
  const time = `${String(Math.floor(remaining / 3600)).padStart(2, "0")}:${String(Math.floor((remaining % 3600) / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;
  if (!active) return null;
  if (hidden)
    return (
      <button
        className="timer-show"
        onClick={() => setHidden(false)}
        title="Mostrar cronômetro"
      >
        Mostrar relógio
      </button>
    );
  if (minimized)
    return (
      <div className="timer timer-minimized">
        <strong>{paused ? "Pausado" : time}</strong>
        <button onClick={() => setMinimized(false)} title="Expandir cronômetro">
          +
        </button>
        <button onClick={() => setHidden(true)} title="Esconder cronômetro">
          ×
        </button>
      </div>
    );
  return (
    <div className="timer" aria-label="Cronômetro de prova">
      <span className="timer-icon">⏱</span>
      <strong>{paused ? "Pausado" : time}</strong>
      <button onClick={() => setMinimized(true)} title="Minimizar">
        −
      </button>
      <button onClick={() => setHidden(true)} title="Esconder cronômetro">
        ×
      </button>
    </div>
  );
}
