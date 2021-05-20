import React from 'react';
import {
  format,
  isSameMonth,
  isSameYear,
  getMinutes,
  getSeconds,
  isSameDay,
} from 'date-fns';

import { LocaleContext } from './LocaleContext';
import { Stack } from './Stack';

export const DEFAULT_RENDER_HEADER = ({ start, end }) => (
  <LocaleContext.Consumer>
    {locale => (
      <div className="SkedifyCalendar__Header">
        {isSameDay(start, end) ? (
          format(start, 'dd LLLL yyyy')
        ) : (
          <React.Fragment>
            {format(
              start,
              isSameYear(start, end)
                ? isSameMonth(start, end)
                  ? 'dd'
                  : 'dd LLLL'
                : 'dd LLLL yyyy',
              { locale }
            )}
            {' - '}
            {format(end, 'dd LLLL yyyy', { locale })}
          </React.Fragment>
        )}
      </div>
    )}
  </LocaleContext.Consumer>
);

export const DEFAULT_RENDER_DAY_HEADER = date => (
  <LocaleContext.Consumer>
    {locale => (
      <div className="SkedifyCalendar__WeekHeader__Days__Day">
        {format(date, 'iiii dd/LL', { locale })}
      </div>
    )}
  </LocaleContext.Consumer>
);

export const DEFAULT_RENDER_EVENT = event => (
  <LocaleContext.Consumer>
    {locale => (
      <div className="SkedifyCalendar__Event">
        {format(event.start, 'HH:mm', { locale })}
        {' - '}
        {format(event.end, 'HH:mm', { locale })}
      </div>
    )}
  </LocaleContext.Consumer>
);

export const DEFAULT_RENDER_PLACEHOLDER = DEFAULT_RENDER_EVENT;

export const DEFAULT_RENDER_GUTTER_ITEM = ({
  time,
  sizeOfOneSlot,
  slotIndex,
}) => {
  const isRoundHour =
    (getMinutes(time) * 60 + getSeconds(time)) % (60 * 60) === 0;

  return (
    <LocaleContext.Consumer>
      {locale => (
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
            ? format(time, 'HH:mm', {
                locale,
              })
            : null}
        </Stack>
      )}
    </LocaleContext.Consumer>
  );
};
