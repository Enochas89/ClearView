import { useMemo } from "react";

export default function useGanttScale(scale) {
  return useMemo(() => {
    const dayMs = 24 * 60 * 60 * 1000;
    const unit = scale === "month" ? 2 : scale === "week" ? 12 : 24; // px/day
    const dateToX = (start, date) => {
      const s = new Date(start).setUTCHours(0, 0, 0, 0);
      const d = new Date(date).setUTCHours(0, 0, 0, 0);
      return ((d - s) / dayMs) * unit;
    };
    const widthFor = (days) => days * unit;
    const snap = (px) => Math.round(px / unit);
    return { unit, dateToX, widthFor, snap };
  }, [scale]);
}
