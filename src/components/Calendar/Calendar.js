import React, { Component } from 'react';
import { v4 as uuid } from 'uuid';

import {
  startOfWeek,
  addDays,
  startOfDay,
  differenceInHours,
  format,
  isSameDay,
  differenceInMinutes,
  setHours,
  setMinutes,
  addMinutes,
  getHours,
  getMinutes,
  differenceInSeconds,
  addSeconds,
  subSeconds,
} from 'date-fns';

import { ComponentMeasurer } from './ComponentMeasurer';
import { DragHandle } from './DragHandle';
import { Stack } from './Stack';

import { isFunction } from '../../utils/isFunction';
import { range } from '../../utils/range';
import { constrain } from '../../utils/constrain';
import { timeStringToSeconds, timeStringToDate } from '../../utils/time';
import { Slot } from './Slot';
import {
  DEFAULT_RENDER_HEADER,
  DEFAULT_RENDER_DAY_HEADER,
  DEFAULT_RENDER_GUTTER_ITEM,
  DEFAULT_RENDER_EVENT,
  DEFAULT_RENDER_PLACEHOLDER,
} from './defaultRenderers';
import { Gutter } from './Gutter';
import { Event } from './Event';
import { LocaleContext, loadLocale } from './LocaleContext';

export const SUNDAY = uuid();
export const MONDAY = uuid();
export const TUESDAY = uuid();
export const WEDNESDAY = uuid();
export const THURSDAY = uuid();
export const FRIDAY = uuid();
export const SATURDAY = uuid();

const PLACEHOLDER_EVENT = uuid();

const DAY_MAP = {
  [SUNDAY]: 0,
  [MONDAY]: 1,
  [TUESDAY]: 2,
  [WEDNESDAY]: 3,
  [THURSDAY]: 4,
  [FRIDAY]: 5,
  [SATURDAY]: 6,
};

const DEFAULT_SLOT_HEIGHT = 20;
const ONE_WEEK = 7;

function hasTimeChanged(start1, end1, start2, end2) {
  return `${start1}` !== `${start2}` || `${end1}` !== `${end2}`;
}

class Calendar extends Component {
  static MONDAY = MONDAY;
  static TUESDAY = TUESDAY;
  static WEDNESDAY = WEDNESDAY;
  static THURSDAY = THURSDAY;
  static FRIDAY = FRIDAY;
  static SATURDAY = SATURDAY;
  static SUNDAY = SUNDAY;

  static DEFAULT_RENDER_HEADER = DEFAULT_RENDER_HEADER;
  static DEFAULT_RENDER_DAY_HEADER = DEFAULT_RENDER_DAY_HEADER;
  static DEFAULT_RENDER_GUTTER_ITEM = DEFAULT_RENDER_GUTTER_ITEM;
  static DEFAULT_RENDER_EVENT = DEFAULT_RENDER_EVENT;
  static DEFAULT_RENDER_PLACEHOLDER = DEFAULT_RENDER_PLACEHOLDER;

  static defaultProps = {
    date: new Date(), // The date to be used to render the calendar
    events: [], // A list of events to render
    locale: 'en',
    weekStartsOn: SUNDAY,
    daysToRender: 7,
    step: 30, // Time in minutes for 1 slot
    minTime: '00:00:00',
    maxTime: '24:00:00',
    renderHeader: DEFAULT_RENDER_HEADER,
    renderDayHeader: DEFAULT_RENDER_DAY_HEADER,
    renderGutterItem: DEFAULT_RENDER_GUTTER_ITEM,
    renderEvent: DEFAULT_RENDER_EVENT,
    renderPlaceholder: DEFAULT_RENDER_PLACEHOLDER,
    canUpdateEvent: () => true,
    canCreateEvent: () => true,
    onEventClick: () => undefined,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      handle: null,
      pseudoEvent: null,
      mainElement: null,
      gutterWidth: 0,
      scrollBarWidth: 0,
    };
  }

  mousePositionToClosestSlot = event => {
    const { gutterWidth, mainElement } = this.state;
    const { step, minTime, daysToRender } = this.props;
    const cursor = { top: event.clientY, left: event.clientX };

    const { left: mainElementLeft, top: mainElementTop } = mainElement.rect();

    // If the cursor is in the scrollbar, don't create a pseudo event
    if (cursor.left - mainElementLeft > mainElement.element.scrollWidth) {
      return undefined;
    }

    const position = {
      left: Math.max(
        0,
        cursor.left -
          mainElementLeft +
          mainElement.element.scrollLeft -
          gutterWidth
      ),
      top: Math.max(
        0,
        cursor.top - mainElementTop + mainElement.element.scrollTop
      ),
    };

    const { start } = this.getVisibleRange();

    const startTime = timeStringToDate(minTime, start);

    const sizeOfOneSlot = this.getSizeOfOneSlot();

    return addDays(
      addMinutes(startTime, Math.floor(position.top / sizeOfOneSlot) * step),
      Math.floor(
        position.left / ((mainElement.width - gutterWidth) / daysToRender)
      )
    );
  };

  createPseudoEvent = (event, handle) => DOMEvent => {
    DOMEvent.preventDefault();
    DOMEvent.stopPropagation();

    const { step } = this.props;

    const closestSlot = this.mousePositionToClosestSlot(DOMEvent);
    const isPlaceholderEvent = event === PLACEHOLDER_EVENT;

    this.setState({
      handle,
      pseudoEvent: {
        ...(isPlaceholderEvent
          ? {
              start: closestSlot,
              end: addMinutes(closestSlot, step),
            }
          : event),
        id: uuid(),
        isPlaceholderEvent,
        mouseStartPositionDiffInSeconds: differenceInSeconds(
          closestSlot,
          event.start
        ),
        isDirty: false,
        original: isPlaceholderEvent
          ? { start: closestSlot, end: closestSlot }
          : event,
      },
    });
  };

  startInteraction = event => {
    const { pseudoEvent } = this.state;

    // There is no pseudo event yet
    // So interaction are a bit useless
    if (!pseudoEvent) {
      return;
    }

    // There is no pressure meaning
    // That the mouse is not pressed down
    if (event.pressure <= 0) {
      return;
    }

    const closestSlot = this.mousePositionToClosestSlot(event);

    const [hours, minutes] = [getHours(closestSlot), getMinutes(closestSlot)];

    const handlers = {
      [DragHandle.PLACEMENT_BOTTOM](state) {
        const nextEnd = setHours(
          setMinutes(state.pseudoEvent.end, minutes),
          hours
        );

        const shouldSwapStartAndEnd =
          differenceInSeconds(nextEnd, state.pseudoEvent.original.start) >= 0;

        return {
          start: shouldSwapStartAndEnd
            ? state.pseudoEvent.original.start
            : nextEnd,
          end: shouldSwapStartAndEnd
            ? nextEnd
            : state.pseudoEvent.original.start,
        };
      },
      [DragHandle.PLACEMENT_TOP](state) {
        const nextStart = setHours(
          setMinutes(state.pseudoEvent.start, minutes),
          hours
        );

        const shouldSwapStartAndEnd =
          differenceInSeconds(nextStart, state.pseudoEvent.original.end) >= 0;

        return {
          start: shouldSwapStartAndEnd
            ? state.pseudoEvent.original.end
            : nextStart,
          end: shouldSwapStartAndEnd
            ? nextStart
            : state.pseudoEvent.original.end,
        };
      },
      [DragHandle.MOVING_INDICATOR](state) {
        const nextStart = subSeconds(
          closestSlot,
          state.pseudoEvent.mouseStartPositionDiffInSeconds
        );

        return {
          start: nextStart,
          end: addSeconds(
            nextStart,
            differenceInSeconds(state.pseudoEvent.end, state.pseudoEvent.start)
          ),
        };
      },
    };

    this.setState(state => ({
      pseudoEvent: {
        ...state.pseudoEvent,
        isDirty: true,
        ...(handlers[state.handle] ? handlers[state.handle](state) : {}),
      },
    }));
  };

  finishInteraction = () => {
    const { pseudoEvent } = this.state;
    const {
      onEventUpdate,
      onEventCreate,
      onEventClick,
      canCreateEvent,
      canUpdateEvent,
    } = this.props;

    if (!pseudoEvent) {
      return;
    }

    const {
      original: event,
      start,
      end,
      isPlaceholderEvent,
      isDirty,
    } = pseudoEvent;

    if (isPlaceholderEvent) {
      // In this case, we don't have an original event
      // Thus, we are working with a new event
      const newEvent = { start, end };
      if (canCreateEvent(newEvent)) {
        onEventCreate({ start, end });
      }
    } else if (isFunction(onEventClick) && !isDirty) {
      // It is the same start & end, so we probably wanted a click...
      onEventClick(event);
    } else if (
      hasTimeChanged(event.start, event.end, start, end) &&
      canUpdateEvent({ event, start, end })
    ) {
      // We do have an existing event
      // Let's update it
      onEventUpdate({
        event,
        start,
        end,
      });
    }

    // Let's clean our pseudo event
    this.setState({
      handle: null,
      pseudoEvent: null,
    });
  };

  cancelInteraction = () => {
    // Let's clean our pseudo event
    this.setState({
      handle: null,
      pseudoEvent: null,
    });
  };

  getAmountOfSlotsToRender = () => {
    const { minTime, maxTime, step } = this.props;

    const { start } = this.getVisibleRange();

    const startTime = timeStringToDate(minTime, start);
    const endTime = timeStringToDate(maxTime, start);

    return Math.round(
      (Math.abs(differenceInHours(endTime, startTime)) + step / 60) *
        (60 / step)
    );
  };

  getSizeOfOneSlot = () => {
    const { mainElement } = this.state;

    if (!mainElement) {
      return DEFAULT_SLOT_HEIGHT;
    }

    return Math.max(
      Math.max(
        mainElement.element.scrollHeight - mainElement.element.offsetTop,
        mainElement.height
      ) / this.getAmountOfSlotsToRender(),
      DEFAULT_SLOT_HEIGHT
    ); // 1 slot is equal to the step. Steps are in minutes
  };

  getVisibleRange = () => {
    const { date, daysToRender, weekStartsOn } = this.props;

    const start =
      daysToRender === ONE_WEEK
        ? startOfWeek(date, { weekStartsOn: DAY_MAP[weekStartsOn] })
        : startOfDay(date);
    const end = addDays(start, daysToRender - 1);

    return { start, end };
  };

  render() {
    const {
      step,
      events,
      onEventUpdate,
      onEventCreate,
      renderHeader,
      renderDayHeader,
      renderGutterItem,
      renderEvent,
      renderPlaceholder,
      daysToRender,
      minTime,
      locale,
      canCreateEvent,
      canUpdateEvent,
    } = this.props;
    const { pseudoEvent, gutterWidth, scrollBarWidth } = this.state;

    const { start, end } = this.getVisibleRange();

    const isUpdatingExistingEventsAllowed = isFunction(onEventUpdate);
    const isCreatingNewEventsAllowed = isFunction(onEventCreate);

    const allEvents = pseudoEvent ? [...events, pseudoEvent] : events;

    const dayHeaderContents = range(daysToRender).map(index =>
      renderDayHeader(addDays(start, index))
    );

    const startTime = timeStringToDate(minTime, start);

    const dayHeaders = dayHeaderContents.every(
      value => value === null
    ) ? null : (
      <Stack align={Stack.align.NORMAL} className="SkedifyCalendar__WeekHeader">
        <div
          key="gutter_spot"
          className="SkedifyCalendar__WeekHeader__Gutter"
          style={{
            width: gutterWidth,
          }}
        />
        <Stack
          distribution={Stack.distribution.BETWEEN}
          className="SkedifyCalendar__WeekHeader__Days"
        >
          {dayHeaderContents.map((contents, index) => (
            <React.Fragment key={index}>{contents}</React.Fragment>
          ))}
        </Stack>
        <div
          key="scrollbar_spot"
          className="SkedifyCalendar__WeekHeader__Scrollbar"
          style={{
            width: scrollBarWidth,
          }}
        />
      </Stack>
    );

    return (
      <LocaleContext.Provider value={loadLocale(locale)}>
        <div className="SkedifyCalendar">
          {/* The calendar header / title */}
          {renderHeader({ start, end })}

          {/* The week header */}
          {dayHeaders}

          <ComponentMeasurer
            onUpdate={({ ref, ...info }) => {
              this.setState(
                {
                  mainElement: info,
                  scrollBarWidth:
                    info.element.offsetWidth - info.element.clientWidth,
                },
                () => {
                  const { scrollToTime, maxTime } = this.props;
                  if (!scrollToTime) {
                    return;
                  }

                  const constrainedScrollToTime = constrain(
                    timeStringToSeconds(format(scrollToTime, 'HH:mm:ss')),
                    timeStringToSeconds(minTime),
                    timeStringToSeconds(maxTime)
                  );

                  const startTimeInSeconds = timeStringToSeconds(
                    format(startTime, 'HH:mm:ss')
                  );

                  const sizeOfOneSlot = this.getSizeOfOneSlot();

                  ref.current.scrollTop =
                    sizeOfOneSlot *
                    ((constrainedScrollToTime - startTimeInSeconds) /
                      60 /
                      step);
                }
              );
            }}
            render={({ ref, element, height = 0 }) => {
              const sizeOfOneSlot = this.getSizeOfOneSlot();
              const slotsToRender = this.getAmountOfSlotsToRender();

              const { scrollHeight = 0, offsetTop = 0 } = element || {};

              const MINIMUM_POSITION = 0;
              const MAXIMUM_POSITION = Math.max(
                scrollHeight - offsetTop,
                height
              );

              return (
                <React.Fragment>
                  {/* The contents of the week */}
                  <Stack
                    ref={ref}
                    distribution={Stack.distribution.AROUND}
                    className="SkedifyCalendar__Main"
                    style={{
                      height: `calc(100% - ${offsetTop}px)`,
                    }}
                    onPointerDown={DOMEvent => {
                      if (isCreatingNewEventsAllowed) {
                        this.createPseudoEvent(
                          PLACEHOLDER_EVENT,
                          DragHandle.PLACEMENT_BOTTOM
                        )(DOMEvent);
                      }
                    }}
                    onPointerMove={this.startInteraction}
                    onPointerUp={this.finishInteraction}
                    onPointerLeave={this.cancelInteraction}
                  >
                    <ComponentMeasurer
                      onUpdate={({ width }) => {
                        this.setState({ gutterWidth: width });
                      }}
                      render={({ ref: gutterRef }) => (
                        <Gutter
                          ref={gutterRef}
                          slotsToRender={slotsToRender}
                          sizeOfOneSlot={sizeOfOneSlot}
                          startTime={format(
                            startTime,
                            `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`
                          )}
                          step={step}
                          render={renderGutterItem}
                        />
                      )}
                    />

                    {range(daysToRender).map(index => {
                      const dateToRender = addDays(start, index);
                      const startOfThisDay = timeStringToDate(
                        minTime,
                        dateToRender
                      );

                      const eventsOnThisDay = allEvents.filter(event =>
                        isSameDay(event.start, dateToRender)
                      );

                      return (
                        <Stack
                          key={index}
                          direction={Stack.direction.VERTICAL}
                          distribution={Stack.distribution.NORMAL}
                          className="SkedifyCalendar__Column"
                        >
                          {range(slotsToRender).map(slotIndex => (
                            <Slot key={slotIndex} height={sizeOfOneSlot} />
                          ))}

                          {/* Render the actual event */}
                          {eventsOnThisDay.map((event, eventIndex) => {
                            const normalPosition =
                              sizeOfOneSlot *
                              (differenceInMinutes(
                                event.start,
                                startOfThisDay
                              ) /
                                step);

                            const positionTop = constrain(
                              normalPosition,
                              MINIMUM_POSITION,
                              MAXIMUM_POSITION
                            );

                            const eventHeight = constrain(
                              Math.round(
                                (sizeOfOneSlot *
                                  differenceInMinutes(event.end, event.start)) /
                                  step
                              ),
                              sizeOfOneSlot,
                              MAXIMUM_POSITION - positionTop
                            );

                            return (
                              <Event
                                key={event.id || eventIndex} // assuming an id exist on the event, if not, use the index
                                event={event}
                                interactionInfo={
                                  event === pseudoEvent &&
                                  event.isPlaceholderEvent
                                    ? {
                                        get isCreatingAllowed() {
                                          return event === pseudoEvent &&
                                            event.isPlaceholderEvent
                                            ? canCreateEvent({
                                                start: event.start,
                                                end: event.end,
                                              })
                                            : false;
                                        },
                                      }
                                    : {
                                        // Can we interact with the current event
                                        get isInteractable() {
                                          return isUpdatingExistingEventsAllowed;
                                        },

                                        // Are we interacting with the current event
                                        get isInteracting() {
                                          return pseudoEvent
                                            ? pseudoEvent.original === event
                                            : false;
                                        },

                                        // Is there another event that is currently being interacted with
                                        get isOtherInteracting() {
                                          return (
                                            pseudoEvent !== null &&
                                            pseudoEvent.original !== event
                                          );
                                        },

                                        // Is current event the pseudo event
                                        get isPseudo() {
                                          return pseudoEvent === event;
                                        },

                                        get isUpdatingAllowed() {
                                          return event === pseudoEvent
                                            ? canUpdateEvent({
                                                event: event.original,
                                                start: event.start,
                                                end: event.end,
                                              })
                                            : true;
                                        },
                                      }
                                }
                                onActivate={
                                  isUpdatingExistingEventsAllowed
                                    ? this.createPseudoEvent
                                    : undefined
                                }
                                positionTop={positionTop}
                                height={
                                  normalPosition < 0
                                    ? eventHeight + normalPosition // We have to subtract the negative part from the height.
                                    : eventHeight
                                }
                                render={
                                  event === pseudoEvent &&
                                  event.isPlaceholderEvent
                                    ? renderPlaceholder
                                    : renderEvent
                                }
                              />
                            );
                          })}
                        </Stack>
                      );
                    })}
                  </Stack>
                </React.Fragment>
              );
            }}
          />
        </div>
      </LocaleContext.Provider>
    );
  }
}

export default Calendar;
