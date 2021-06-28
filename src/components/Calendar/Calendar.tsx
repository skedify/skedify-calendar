import React, { Component } from "react";
import { IEvent, RenderDayHeader, RenderEvent, RenderGutterItem, RenderHeader } from "@app/types";
import {
  addDays,
  addMinutes,
  addSeconds,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  getHours,
  getMinutes,
  isSameDay,
  Locale,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
  subSeconds,
} from "date-fns";
import { v4 as uuid } from "uuid";

import { constrain } from "../../utils/constrain";
import { range } from "../../utils/range";
import { timeStringToDate, timeStringToSeconds } from "../../utils/time";

import { ComponentMeasurer } from "./ComponentMeasurer";
import {
  DEFAULT_RENDER_DAY_HEADER,
  DEFAULT_RENDER_EVENT,
  DEFAULT_RENDER_GUTTER_ITEM,
  DEFAULT_RENDER_HEADER,
  DEFAULT_RENDER_PLACEHOLDER,
} from "./defaultRenderers";
import { DragHandle, PLACEMENT } from "./DragHandle";
import { Event } from "./Event";
import { Gutter } from "./Gutter";
import { loadLocale, LocaleContext, SupportedLocales } from "./LocaleContext";
import { Slot } from "./Slot";
import { Stack } from "./Stack";

import "../../index.css";

enum DAY {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
}

const PLACEHOLDER_EVENT = "__PLACEHOLDER_EVENT__";

const DEFAULT_SLOT_HEIGHT = 20;
const ONE_WEEK = 7;

function hasTimeChanged(start1: Date, end1: Date, start2: Date, end2: Date) {
  return `${start1}` !== `${start2}` || `${end1}` !== `${end2}`;
}

interface Props {
  date: Date;
  events: IEvent[];
  locale: "en" | SupportedLocales | Locale;
  weekStartsOn: DAY;
  daysToRender: number;
  step: number;

  minTime: string;
  maxTime: string;

  scrollToTime?: number | Date;
  renderHeader: RenderHeader;
  renderDayHeader: RenderDayHeader;
  renderGutterItem: RenderGutterItem;
  renderEvent: RenderEvent;
  renderPlaceholder: RenderEvent;

  canCreateEvent: (args: { start: Date; end: Date }) => boolean;
  onEventCreate: (args: { start: Date; end: Date }) => void;
  canUpdateEvent: (args: { event: IEvent; start: Date; end: Date }) => boolean;
  onEventUpdate: (args: { event: IEvent; start: Date; end: Date }) => void;

  onEventClick: (event: IEvent) => void;
}

interface State {
  mainElement: null | {
    height?: number | undefined;
    width?: number | undefined;
    element?: HTMLDivElement | null | undefined;
    rect?:
      | (() =>
          | {
              top: number;
              left: number;
            }
          | undefined)
      | undefined;
  };
  scrollBarWidth: number;
  gutterWidth: number;
  handle: null | PLACEMENT;
  pseudoEvent: null | IEvent;
}

class Calendar extends Component<Props, State> {
  static MONDAY = DAY.MONDAY;
  static TUESDAY = DAY.TUESDAY;
  static WEDNESDAY = DAY.WEDNESDAY;
  static THURSDAY = DAY.THURSDAY;
  static FRIDAY = DAY.FRIDAY;
  static SATURDAY = DAY.SATURDAY;
  static SUNDAY = DAY.SUNDAY;

  static DEFAULT_RENDER_HEADER = DEFAULT_RENDER_HEADER;
  static DEFAULT_RENDER_DAY_HEADER = DEFAULT_RENDER_DAY_HEADER;
  static DEFAULT_RENDER_GUTTER_ITEM = DEFAULT_RENDER_GUTTER_ITEM;
  static DEFAULT_RENDER_EVENT = DEFAULT_RENDER_EVENT;
  static DEFAULT_RENDER_PLACEHOLDER = DEFAULT_RENDER_PLACEHOLDER;

  static defaultProps = {
    date: new Date(), // The date to be used to render the calendar
    events: [], // A list of events to render
    locale: "en",
    weekStartsOn: DAY.SUNDAY,
    daysToRender: 7,
    step: 30, // Time in minutes for 1 slot
    minTime: "00:00:00",
    maxTime: "24:00:00",
    renderHeader: DEFAULT_RENDER_HEADER,
    renderDayHeader: DEFAULT_RENDER_DAY_HEADER,
    renderGutterItem: DEFAULT_RENDER_GUTTER_ITEM,
    renderEvent: DEFAULT_RENDER_EVENT,
    renderPlaceholder: DEFAULT_RENDER_PLACEHOLDER,
    canUpdateEvent: () => true,
    canCreateEvent: () => true,
    onEventClick: () => undefined,
  };

  state: State = {
    gutterWidth: 0,
    scrollBarWidth: 0,
    mainElement: null,
    handle: null,
    pseudoEvent: null,
  };

  mousePositionToClosestSlot = (event: React.PointerEvent<HTMLDivElement | HTMLButtonElement>) => {
    const { gutterWidth, mainElement } = this.state;
    const { daysToRender, minTime, step } = this.props;
    const cursor = { top: event.clientY, left: event.clientX };

    const { left: mainElementLeft, top: mainElementTop } = mainElement!.rect!()!;

    // If the cursor is in the scrollbar, don't create a pseudo event
    if (cursor.left - mainElementLeft > mainElement!.element!.scrollWidth) {
      return undefined;
    }

    const position = {
      left: Math.max(
        0,
        cursor.left - mainElementLeft + mainElement!.element!.scrollLeft - gutterWidth
      ),
      top: Math.max(0, cursor.top - mainElementTop + mainElement!.element!.scrollTop),
    };

    const { start } = this.getVisibleRange();

    const startTime = timeStringToDate(minTime, start);

    const sizeOfOneSlot = this.getSizeOfOneSlot();

    return addDays(
      addMinutes(startTime, Math.floor(position.top / sizeOfOneSlot) * step),
      Math.floor(position.left / ((mainElement!.width! - gutterWidth) / daysToRender))
    );
  };

  createPseudoEvent =
    (event: IEvent | typeof PLACEHOLDER_EVENT, handle: PLACEMENT) =>
    (DOMEvent: React.PointerEvent<HTMLDivElement | HTMLButtonElement>) => {
      DOMEvent.preventDefault();
      DOMEvent.stopPropagation();

      const { step } = this.props;

      const closestSlot = this.mousePositionToClosestSlot(DOMEvent);

      // TODO check?
      if (!closestSlot) return;

      this.setState({
        handle,
        pseudoEvent: {
          ...(event === PLACEHOLDER_EVENT
            ? {
                start: closestSlot,
                end: addMinutes(closestSlot, step),
              }
            : event),
          id: uuid(),
          isPlaceholderEvent: event === PLACEHOLDER_EVENT,
          mouseStartPositionDiffInSeconds:
            event === PLACEHOLDER_EVENT
              ? //@ts-ignore
                differenceInSeconds(closestSlot, undefined)
              : differenceInSeconds(closestSlot, event.start),
          isDirty: false,
          original: event === PLACEHOLDER_EVENT ? { start: closestSlot, end: closestSlot } : event,
        },
      });
    };

  startInteraction = (event: React.PointerEvent<HTMLDivElement>) => {
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

    if (!closestSlot) return;

    const [hours, minutes] = [getHours(closestSlot), getMinutes(closestSlot)];

    const handlers = {
      [DragHandle.PLACEMENT.PLACEMENT_BOTTOM](state: State) {
        // invariant(state.pseudoEvent);
        // invariant(state.pseudoEvent.original);

        const nextEnd = setHours(setMinutes(state.pseudoEvent!.end, minutes), hours);

        const shouldSwapStartAndEnd =
          differenceInSeconds(nextEnd, state.pseudoEvent!.original!.start) >= 0;

        return {
          start: shouldSwapStartAndEnd ? state.pseudoEvent!.original!.start : nextEnd,
          end: shouldSwapStartAndEnd ? nextEnd : state.pseudoEvent!.original!.start,
        };
      },
      [DragHandle.PLACEMENT.PLACEMENT_TOP](state: State) {
        // invariant(state.pseudoEvent);
        // invariant(state.pseudoEvent.original);

        const nextStart = setHours(setMinutes(state.pseudoEvent!.start, minutes), hours);

        const shouldSwapStartAndEnd =
          differenceInSeconds(nextStart, state.pseudoEvent!.original!.end) >= 0;

        return {
          start: shouldSwapStartAndEnd ? state.pseudoEvent!.original!.end : nextStart,
          end: shouldSwapStartAndEnd ? nextStart : state.pseudoEvent!.original!.end,
        };
      },
      [DragHandle.PLACEMENT.MOVING_INDICATOR](state: State) {
        // invariant(state.pseudoEvent);
        // invariant(state.pseudoEvent.mouseStartPositionDiffInSeconds);

        const nextStart = subSeconds(
          closestSlot,
          state.pseudoEvent!.mouseStartPositionDiffInSeconds!
        );

        return {
          start: nextStart,
          end: addSeconds(
            nextStart,
            differenceInSeconds(state.pseudoEvent!.end, state.pseudoEvent!.start)
          ),
        };
      },
    };

    this.setState((state) => ({
      pseudoEvent: {
        ...state.pseudoEvent!,
        isDirty: true,
        ...(state.handle == null
          ? {}
          : !handlers[state.handle]
          ? {}
          : handlers[state.handle](state)),
      },
    }));
  };

  finishInteraction = () => {
    const { pseudoEvent } = this.state;
    const { canCreateEvent, canUpdateEvent, onEventClick, onEventCreate, onEventUpdate } =
      this.props;

    if (!pseudoEvent) {
      return;
    }

    const { end, isDirty, isPlaceholderEvent, original: event, start } = pseudoEvent;

    // invariant(event);

    if (isPlaceholderEvent) {
      // In this case, we don't have an original event
      // Thus, we are working with a new event
      const newEvent = { start, end };
      if (canCreateEvent(newEvent)) {
        onEventCreate({ start, end });
      }
    } else if (onEventClick && !isDirty) {
      // It is the same start & end, so we probably wanted a click...
      onEventClick(event!);
    } else if (
      hasTimeChanged(event!.start, event!.end, start, end) &&
      canUpdateEvent({ event: event!, start, end })
    ) {
      // We do have an existing event
      // Let's update it
      onEventUpdate({
        event: event!,
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

  cancelInteraction = (event: React.PointerEvent<HTMLDivElement>) => {
    // Let's clean our pseudo event
    this.setState({
      handle: null,
      pseudoEvent: null,
    });
  };

  getAmountOfSlotsToRender = () => {
    const { maxTime, minTime, step } = this.props;

    const { start } = this.getVisibleRange();

    const startTime = timeStringToDate(minTime, start);
    const endTime = timeStringToDate(maxTime, start);

    return Math.round((Math.abs(differenceInHours(endTime, startTime)) + step / 60) * (60 / step));
  };

  getSizeOfOneSlot = () => {
    const { mainElement } = this.state;

    if (!mainElement) {
      return DEFAULT_SLOT_HEIGHT;
    }

    // invariant(mainElement.element);
    // invariant(mainElement.height);

    return Math.max(
      Math.max(
        mainElement!.element!.scrollHeight - mainElement!.element!.offsetTop,
        mainElement!.height!
      ) / this.getAmountOfSlotsToRender(),
      DEFAULT_SLOT_HEIGHT
    ); // 1 slot is equal to the step. Steps are in minutes
  };

  getVisibleRange = () => {
    const { date, daysToRender, weekStartsOn } = this.props;

    const start =
      daysToRender === ONE_WEEK ? startOfWeek(date, { weekStartsOn }) : startOfDay(date);
    const end = addDays(start, daysToRender - 1);

    return { start, end };
  };

  render() {
    const {
      canCreateEvent,
      canUpdateEvent,
      daysToRender,
      events,
      locale,
      minTime,
      onEventCreate,
      onEventUpdate,
      renderDayHeader: DayHeader,
      renderEvent,
      renderGutterItem,
      renderHeader: Header,
      renderPlaceholder,
      step,
    } = this.props;
    const { gutterWidth, pseudoEvent, scrollBarWidth } = this.state;

    const { end, start } = this.getVisibleRange();

    const isUpdatingExistingEventsAllowed = !!onEventUpdate;
    const isCreatingNewEventsAllowed = !!onEventCreate;

    const allEvents = pseudoEvent ? [...events, pseudoEvent] : events;

    const dayHeaderContents = range(daysToRender).map((index) => (
      // renderDayHeader({ date: addDays(start, index) })
      <DayHeader date={addDays(start, index)} />
    ));

    const startTime = timeStringToDate(minTime, start);

    const dayHeaders = dayHeaderContents.every((value) => value === null) ? null : (
      <Stack align={Stack.align.NORMAL} className="SkedifyCalendar__WeekHeader">
        <div
          className="SkedifyCalendar__WeekHeader__Gutter"
          key="gutter_spot"
          style={{
            width: gutterWidth,
          }}
        />
        <Stack
          className="SkedifyCalendar__WeekHeader__Days"
          distribution={Stack.distribution.BETWEEN}
        >
          {dayHeaderContents.map((contents, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <React.Fragment key={index}>{contents}</React.Fragment>
          ))}
        </Stack>
        <div
          className="SkedifyCalendar__WeekHeader__Scrollbar"
          key="scrollbar_spot"
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
          <Header end={end} start={start} />

          {/* The week header */}
          {dayHeaders}

          <ComponentMeasurer
            onUpdate={(info) => {
              this.setState(
                {
                  mainElement: info,
                  scrollBarWidth: info.element.offsetWidth - info.element.clientWidth,
                },
                () => {
                  const { maxTime, scrollToTime } = this.props;
                  if (!scrollToTime) {
                    return;
                  }

                  const constrainedScrollToTime = constrain(
                    timeStringToSeconds(format(scrollToTime, "HH:mm:ss")),
                    timeStringToSeconds(minTime),
                    timeStringToSeconds(maxTime)
                  );

                  const startTimeInSeconds = timeStringToSeconds(format(startTime, "HH:mm:ss"));

                  const sizeOfOneSlot = this.getSizeOfOneSlot();

                  info.element.scrollTop =
                    sizeOfOneSlot * ((constrainedScrollToTime - startTimeInSeconds) / 60 / step);
                }
              );
            }}
            render={({ element, height = 0, ref }) => {
              const sizeOfOneSlot = this.getSizeOfOneSlot();
              const slotsToRender = this.getAmountOfSlotsToRender();

              const { offsetTop = 0, scrollHeight = 0 } = element || {};

              const MINIMUM_POSITION = 0;
              const MAXIMUM_POSITION = Math.max(scrollHeight - offsetTop, height);

              return (
                <React.Fragment>
                  {/* The contents of the week */}
                  <Stack
                    className="SkedifyCalendar__Main"
                    distribution={Stack.distribution.AROUND}
                    onPointerDown={(DOMEvent) => {
                      if (isCreatingNewEventsAllowed) {
                        this.createPseudoEvent(
                          PLACEHOLDER_EVENT,
                          DragHandle.PLACEMENT.PLACEMENT_BOTTOM
                        )(DOMEvent);
                      }
                    }}
                    onPointerLeave={this.cancelInteraction}
                    onPointerMove={this.startInteraction}
                    onPointerUp={this.finishInteraction}
                    ref={ref}
                    style={{
                      height: `calc(100% - ${offsetTop}px)`,
                    }}
                  >
                    <ComponentMeasurer
                      onUpdate={({ width }) => {
                        width != null && this.setState({ gutterWidth: width });
                      }}
                      render={({ ref: gutterRef }) => (
                        <Gutter
                          ref={gutterRef}
                          render={renderGutterItem}
                          sizeOfOneSlot={sizeOfOneSlot}
                          slotsToRender={slotsToRender}
                          startTime={format(startTime, `yyyy-MM-dd'T'HH:mm:ss.SSSxxx`)}
                          step={step}
                        />
                      )}
                    />

                    {range(daysToRender).map((index) => {
                      const dateToRender = addDays(start, index);
                      const startOfThisDay = timeStringToDate(minTime, dateToRender);

                      const eventsOnThisDay = allEvents.filter((event) =>
                        isSameDay(event.start, dateToRender)
                      );

                      return (
                        <Stack
                          className="SkedifyCalendar__Column"
                          direction={Stack.direction.VERTICAL}
                          distribution={Stack.distribution.NORMAL}
                          key={index}
                        >
                          {range(slotsToRender).map((slotIndex) => (
                            <Slot height={sizeOfOneSlot} key={slotIndex} />
                          ))}

                          {/* Render the actual event */}
                          {eventsOnThisDay.map((event, eventIndex) => {
                            const normalPosition =
                              sizeOfOneSlot *
                              (differenceInMinutes(event.start, startOfThisDay) / step);

                            const positionTop = constrain(
                              normalPosition,
                              MINIMUM_POSITION,
                              MAXIMUM_POSITION
                            );

                            const eventHeight = constrain(
                              Math.round(
                                (sizeOfOneSlot * differenceInMinutes(event.end, event.start)) / step
                              ),
                              sizeOfOneSlot,
                              MAXIMUM_POSITION - positionTop
                            );

                            return (
                              <Event
                                event={event} // assuming an id exist on the event, if not, use the index
                                height={
                                  normalPosition < 0
                                    ? eventHeight + normalPosition // We have to subtract the negative part from the height.
                                    : eventHeight
                                }
                                interactionInfo={
                                  event === pseudoEvent && event.isPlaceholderEvent
                                    ? {
                                        get isCreatingAllowed() {
                                          return event === pseudoEvent && event.isPlaceholderEvent
                                            ? canCreateEvent({
                                                start: event.start,
                                                end: event.end,
                                              })
                                            : false;
                                        },
                                        isInteractable: false,
                                        isInteracting: false,
                                        isOtherInteracting: false,
                                        isPseudo: false,
                                        isUpdatingAllowed: false,
                                      }
                                    : {
                                        isCreatingAllowed: false,
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
                                            pseudoEvent !== null && pseudoEvent.original !== event
                                          );
                                        },

                                        // Is current event the pseudo event
                                        get isPseudo() {
                                          return pseudoEvent === event;
                                        },

                                        get isUpdatingAllowed() {
                                          // invariant(event.original);

                                          return event === pseudoEvent
                                            ? canUpdateEvent({
                                                event: event.original!,
                                                start: event.start,
                                                end: event.end,
                                              })
                                            : true;
                                        },
                                      }
                                }
                                key={event.id || eventIndex}
                                onActivate={
                                  isUpdatingExistingEventsAllowed
                                    ? this.createPseudoEvent
                                    : undefined
                                }
                                positionTop={positionTop}
                                render={
                                  event === pseudoEvent && event.isPlaceholderEvent
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
