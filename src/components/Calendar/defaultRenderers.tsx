import React, { useContext } from "react";
import { RenderDayHeader, RenderEvent, RenderGutterItem, RenderHeader } from "@app/types";
import { format, getMinutes, getSeconds, isSameDay, isSameMonth, isSameYear } from "date-fns";

import { LocaleContext } from "./LocaleContext";
import { Stack } from "./Stack";

export const DEFAULT_RENDER_HEADER: RenderHeader = ({ end, start }) => {
  const locale = useContext(LocaleContext);

  return (
    <div className="SkedifyCalendar__Header">
      {isSameDay(start, end) ? (
        format(start, "dd LLLL yyyy")
      ) : (
        <>
          {format(
            start,
            isSameYear(start, end) ? (isSameMonth(start, end) ? "dd" : "dd LLLL") : "dd LLLL yyyy",
            { locale }
          )}
          {" - "}
          {format(end, "dd LLLL yyyy", { locale })}
        </>
      )}
    </div>
  );
};

export const DEFAULT_RENDER_DAY_HEADER: RenderDayHeader = ({ date }) => {
  const locale = useContext(LocaleContext);

  return (
    <div className="SkedifyCalendar__WeekHeader__Days__Day">
      {format(date, "iiii dd/LL", { locale })}
    </div>
  );
};

export const DEFAULT_RENDER_EVENT: RenderEvent = ({ event }) => {
  const locale = useContext(LocaleContext);

  return (
    <div className="SkedifyCalendar__Event">
      {format(event.start, "HH:mm", { locale })}
      {" - "}
      {format(event.end, "HH:mm", { locale })}
    </div>
  );
};

export const DEFAULT_RENDER_PLACEHOLDER = DEFAULT_RENDER_EVENT;

export const DEFAULT_RENDER_GUTTER_ITEM: RenderGutterItem = ({
  sizeOfOneSlot,
  slotIndex,
  time,
}) => {
  const isRoundHour = (getMinutes(time) * 60 + getSeconds(time)) % (60 * 60) === 0;
  const locale = useContext(LocaleContext);

  return (
    <Stack
      className="SkedifyCalendar__Gutter__Slot__Contents"
      style={{
        lineHeight: `${sizeOfOneSlot}px`,
        marginTop: -(sizeOfOneSlot / 2),
      }}
    >
      {slotIndex === 0
        ? null
        : isRoundHour
        ? format(time, "HH:mm", {
            locale,
          })
        : null}
    </Stack>
  );
};
