import React, { memo } from 'react';
import uuid from 'uuid';
import { isFunction } from '../../utils/isFunction';

const PLACEMENT_TOP = uuid();
const PLACEMENT_BOTTOM = uuid();
const MOVING_INDICATOR = uuid();

const PLACEMENT_MAP = {
  [PLACEMENT_TOP]() {
    return { top: 0 };
  },
  [PLACEMENT_BOTTOM]() {
    return { bottom: 0 };
  },
  [MOVING_INDICATOR]() {
    return { width: '100%', height: '100%' };
  },
};

function DragHandleComponent({ placement, onActivate, children }) {
  const size = 8;

  if (placement === MOVING_INDICATOR) {
    return (
      <div style={PLACEMENT_MAP[placement]()} onPointerDown={onActivate}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onPointerDown={onActivate}
      className="SkedifyCalendar__DragHandle"
      style={{
        height: size,
        ...(isFunction(PLACEMENT_MAP[placement])
          ? PLACEMENT_MAP[placement]()
          : {}),
      }}
    />
  );
}

export const DragHandle = memo(DragHandleComponent);

DragHandle.PLACEMENT_TOP = PLACEMENT_TOP;
DragHandle.PLACEMENT_BOTTOM = PLACEMENT_BOTTOM;
DragHandle.MOVING_INDICATOR = MOVING_INDICATOR;
