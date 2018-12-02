import React, { memo } from 'react';

function SlotComponent({ height }) {
  return (
    <div
      className="SkedifyCalendar__Slot"
      style={{
        height: height,
      }}
    />
  );
}

export const Slot = memo(SlotComponent);
