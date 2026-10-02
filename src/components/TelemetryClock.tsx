import React, { useEffect, useState } from "react";

interface TelemetryClockProps {
  className?: string;
  prefix?: string;
  showMs?: boolean;
}

export const TelemetryClock: React.FC<TelemetryClockProps> = React.memo(
  ({ className = "", prefix = "IST ", showMs = true }) => {
    const [timeStr, setTimeStr] = useState<string>("--:--:--");

    useEffect(() => {
      const update = () => {
        if (document.visibilityState === "hidden") return;
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const istDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + istOffset);
        const h = String(istDate.getHours()).padStart(2, "0");
        const m = String(istDate.getMinutes()).padStart(2, "0");
        const s = String(istDate.getSeconds()).padStart(2, "0");
        if (showMs) {
          const ms = String(istDate.getMilliseconds()).padStart(3, "0");
          setTimeStr(`${prefix}${h}:${m}:${s}.${ms}`);
        } else {
          setTimeStr(`${prefix}${h}:${m}:${s}`);
        }
      };
      update();
      const intervalId = window.setInterval(update, showMs ? 250 : 1000);
      return () => window.clearInterval(intervalId);
    }, [prefix, showMs]);

    return <span className={`tabular-nums ${className}`}>{timeStr}</span>;
  },
);

TelemetryClock.displayName = "TelemetryClock";
