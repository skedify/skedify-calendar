import React, { memo } from "react";

function SlotComponent({ height }: { height: React.CSSProperties["height"] }) {
  return <div className="SkedifyCalendar__Slot" style={{ height }} />;
}

export const Slot = memo(SlotComponent);
