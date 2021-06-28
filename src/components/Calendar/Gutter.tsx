import React, { forwardRef, memo } from "react";
import { RenderGutterItem } from "@app/types";
import { addMinutes, parseISO } from "date-fns";

import { range } from "../../utils/range";

import { Stack } from "./Stack";

interface GutterProps {
  render: RenderGutterItem;
  sizeOfOneSlot: number;
  slotsToRender: number;
  startTime: string;
  step: number;
}

const GutterComponent = forwardRef<HTMLDivElement, GutterProps>(
  ({ render: Component, sizeOfOneSlot, slotsToRender, startTime, step }, ref) => {
    return (
      <Stack
        className="SkedifyCalendar__Gutter"
        direction={Stack.direction.VERTICAL}
        distribution={Stack.distribution.NORMAL}
        ref={ref}
      >
        {range(slotsToRender).map((slotIndex) => {
          const time = addMinutes(parseISO(startTime), slotIndex * step);

          return (
            <div
              className="SkedifyCalendar__Gutter__Slot"
              key={slotIndex}
              style={{ height: sizeOfOneSlot }}
            >
              <Component sizeOfOneSlot={sizeOfOneSlot} slotIndex={slotIndex} time={time} />
            </div>
          );
        })}
      </Stack>
    );
  }
);

export const Gutter = memo(GutterComponent);
