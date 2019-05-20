import React, { memo } from 'react';

import { isFunction } from '../../utils/isFunction';

import { DragHandle } from './DragHandle';

function EventWrapper({ children, positionTop, height }) {
  return (
    <div
      className="SkedifyCalendar__EventWrapper"
      style={{
        transform: `translateY(${positionTop}px)`,
        height,
      }}
    >
      {children}
    </div>
  );
}

function EventComponent({
  event,
  onActivate,
  render,
  positionTop,
  height,
  interactionInfo,
}) {
  const shouldBeInteractable = isFunction(onActivate);

  if (!shouldBeInteractable) {
    return (
      <EventWrapper positionTop={positionTop} height={height}>
        {render(event, interactionInfo)}
      </EventWrapper>
    );
  }

  return (
    <EventWrapper positionTop={positionTop} height={height}>
      <DragHandle
        placement={DragHandle.PLACEMENT_TOP}
        onActivate={onActivate(event, DragHandle.PLACEMENT_TOP)}
      />

      <DragHandle
        placement={DragHandle.MOVING_INDICATOR}
        onActivate={onActivate(event, DragHandle.MOVING_INDICATOR)}
      >
        {render(event, interactionInfo)}
      </DragHandle>

      <DragHandle
        placement={DragHandle.PLACEMENT_BOTTOM}
        onActivate={onActivate(event, DragHandle.PLACEMENT_BOTTOM)}
      />
    </EventWrapper>
  );
}

export const Event = memo(EventComponent);
