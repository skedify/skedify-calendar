import React, { memo } from "react";
import { IEvent, InteractionInfo, OnActivate, RenderEvent } from "@app/types";

import { DragHandle, PLACEMENT } from "./DragHandle";

interface EventWrapperProps {
  children: React.ReactNode;
  height: React.CSSProperties["height"];
  positionTop: number;
}

function EventWrapper({ children, height, positionTop }: EventWrapperProps) {
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

interface EventComponentProps {
  event: IEvent;
  height: React.CSSProperties["height"];
  interactionInfo: InteractionInfo;
  onActivate?: (event: IEvent, placement: PLACEMENT) => OnActivate;
  positionTop: number;
  render: RenderEvent;
}

function EventComponent({
  event,
  height,
  interactionInfo,
  onActivate,
  positionTop,
  render: Component,
}: EventComponentProps) {
  if (!onActivate) {
    return (
      <EventWrapper height={height} positionTop={positionTop}>
        <Component event={event} interactionInfo={interactionInfo} />
      </EventWrapper>
    );
  }

  return (
    <EventWrapper height={height} positionTop={positionTop}>
      <DragHandle
        onActivate={onActivate(event, DragHandle.PLACEMENT.PLACEMENT_TOP)}
        placement={DragHandle.PLACEMENT.PLACEMENT_TOP}
      />

      <DragHandle
        onActivate={onActivate(event, DragHandle.PLACEMENT.MOVING_INDICATOR)}
        placement={DragHandle.PLACEMENT.MOVING_INDICATOR}
      >
        <Component event={event} interactionInfo={interactionInfo} />
      </DragHandle>

      <DragHandle
        onActivate={onActivate(event, DragHandle.PLACEMENT.PLACEMENT_BOTTOM)}
        placement={DragHandle.PLACEMENT.PLACEMENT_BOTTOM}
      />
    </EventWrapper>
  );
}

export const Event = memo(EventComponent);
