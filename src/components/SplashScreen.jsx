import { useEffect, useState } from "react";

const SPLASH_DURATION = 1350;
const EXIT_DURATION = 320;

function isInstalledPwa() {
  if (typeof window === "undefined") return false;

  const displayModes = ["standalone", "fullscreen", "minimal-ui"];
  const hasInstalledDisplayMode = displayModes.some(
    (mode) => window.matchMedia(`(display-mode: ${mode})`).matches,
  );

  return hasInstalledDisplayMode || window.navigator.standalone === true;
}

export default function SplashScreen() {
  const [visible, setVisible] = useState(isInstalledPwa);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return undefined;

    const exitTimer = window.setTimeout(() => {
      setExiting(true);
    }, SPLASH_DURATION);
    const removeTimer = window.setTimeout(() => {
      setVisible(false);
    }, SPLASH_DURATION + EXIT_DURATION);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`pwa-splash${exiting ? " is-exiting" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Carregando Estudos OAB"
    >
      <div className="pwa-splash-content">
        <div className="pwa-splash-mark" aria-hidden="true">
          <img src="/favicon.svg" alt="" />
          <span />
        </div>
        <p className="pwa-splash-title">Estudos OAB</p>
        <p className="pwa-splash-caption">Seu próximo passo começa agora</p>
      </div>
    </div>
  );
}
