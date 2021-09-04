import React, { memo } from "react";
import { OnActivate } from "@app/types";

export enum PLACEMENT {
  PLACEMENT_TOP,
  PLACEMENT_BOTTOM,
  MOVING_INDICATOR,
}

const PLACEMENT_MAP: { [key in PLACEMENT]: React.CSSProperties | undefined } = {
  [PLACEMENT.PLACEMENT_TOP]: { top: 0 },
  [PLACEMENT.PLACEMENT_BOTTOM]: { bottom: 0 },
  [PLACEMENT.MOVING_INDICATOR]: { width: "100%", height: "100%" },
};

interface Props {
  children?: React.ReactNode;
  onActivate: OnActivate;
  placement: PLACEMENT;
}

function DragHandleComponent({ children, onActivate, placement }: Props) {
  const size = 8;

  const placementProps = PLACEMENT_MAP[placement];

  if (placement === PLACEMENT.MOVING_INDICATOR) {
    return (
      <div onPointerDown={onActivate} style={placementProps}>
        {children}
      </div>
    );
  }

  return (
    <button
      className="SkedifyCalendar__DragHandle"
      onPointerDown={onActivate}
      style={{
        height: size,
        ...placementProps,
      }}
      type="button"
    />
  );
}

interface DragHandleResult extends React.MemoExoticComponent<typeof DragHandleComponent> {
  PLACEMENT: typeof PLACEMENT;
}

export const DragHandle = memo(DragHandleComponent) as DragHandleResult;

DragHandle.PLACEMENT = PLACEMENT;
