import React, { memo, forwardRef } from 'react';
import { Stack } from './Stack';
import { range } from '../../utils/range';
import { addMinutes } from 'date-fns';

function GutterComponent(
  { slotsToRender, sizeOfOneSlot, startTime, step, render },
  ref
) {
  return (
    <Stack
      ref={ref}
      direction={Stack.direction.VERTICAL}
      distribution={Stack.distribution.NORMAL}
      className="SkedifyCalendar__Gutter"
    >
      {range(slotsToRender).map(slotIndex => {
        const time = addMinutes(startTime, slotIndex * step);

        return (
          <div
            key={slotIndex}
            className="SkedifyCalendar__Gutter__Slot"
            style={{
              height: sizeOfOneSlot,
            }}
          >
            {render({ time, slotIndex, sizeOfOneSlot })}
          </div>
        );
      })}
    </Stack>
  );
}

export const Gutter = memo(forwardRef(GutterComponent));
