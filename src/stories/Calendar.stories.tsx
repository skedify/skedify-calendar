import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { areIntervalsOverlapping, format } from "date-fns";
import { it } from "date-fns/locale";

import Calendar from "../components/Calendar/Calendar";

import "./demo.css";

export default {
  title: "Calendar",
  component: Calendar,

  argTypes: {
    // backgroundColor: { control: 'color' },
    date: { control: "date" },
    step: { control: "number" },
    minTime: { control: "text" },
    scrollToTime: { control: "date" },
    events: { control: "object" },
    onEventClick: { action: "onEventClick" },
    onEventCreate: { action: "onEventCreate" },
    onEventUpdate: { action: "onEventUpdate" },
  },
} as ComponentMeta<typeof Calendar>;

const Template: ComponentStory<typeof Calendar> = (args) => <Calendar {...args} />;

export const BasicUsage = Template.bind({});
BasicUsage.args = {};

export const RenderingEvents = Template.bind({});

RenderingEvents.parameters = {
  docs: {
    description: {
      story: "Some story **markdown**",
    },
  },
};

RenderingEvents.args = {
  date: new Date(2001, 0, 1),
  events: [
    {
      start: new Date(2001, 0, 1, 6, 30, 0),
      end: new Date(2001, 0, 1, 8, 0, 0),
    },
    {
      start: new Date(2001, 0, 2, 6, 0, 0),
      end: new Date(2001, 0, 2, 8, 30, 0),
    },
    {
      start: new Date(2001, 0, 3, 5, 30, 0),
      end: new Date(2001, 0, 3, 9, 0, 0),
    },
    {
      start: new Date(2001, 0, 4, 5, 0, 0),
      end: new Date(2001, 0, 4, 9, 30, 0),
    },
    {
      start: new Date(2001, 0, 5, 4, 30, 0),
      end: new Date(2001, 0, 5, 10, 0, 0),
    },
    {
      start: new Date(2001, 0, 6, 4, 0, 0),
      end: new Date(2001, 0, 6, 10, 30, 0),
    },
    {
      start: new Date(2001, 0, 7, 3, 30, 0),
      end: new Date(2001, 0, 7, 11, 0, 0),
    },
  ],
};

const StatefulTemplate: ComponentStory<typeof Calendar> = ({ events: initialEvents, ...args }) => {
  const [events, setEvents] = useState(initialEvents);

  return (
    <Calendar
      {...args}
      events={events}
      onEventUpdate={({ end, event, start }) => {
        args.onEventUpdate({ event, start, end });
        setEvents((events) =>
          events.map((storedEvent) => {
            if (storedEvent === event) {
              return { ...storedEvent, start, end };
            }

            return storedEvent;
          })
        );
      }}
      renderEvent={({ event, interactionInfo: info }) => (
        <div
          style={{
            backgroundColor: "white",
            opacity: info.isInteracting ? 0.5 : 1,
            marginLeft: 1,
            marginRight: 1,
            color: "#282C34",
            boxShadow: "inset 0 0 0 2px #ccc",
            borderLeft: "4px solid #0541C8",
            padding: 10,
            height: "100%",
          }}
        >
          <span>
            {event.start.toLocaleTimeString()} - {event.end.toLocaleTimeString()}
          </span>
          <pre style={{ fontSize: 14 }}>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
    />
  );
};

export const CustomEventRendering = StatefulTemplate.bind({});

CustomEventRendering.parameters = {
  docs: {
    description: {
      story:
        "In this example we render the events a bit differently compared to the default. We also render the `interactionInfo` for each event, you can find more about this in the [props#renderEvent](/props#renderevent) section.In this example you can also resize and move events around. The contents of each event will be updated with the new `event` and `interactionInfo`. We also make sure that the currently interacting event is a bit more transparent.",
    },
  },
};

CustomEventRendering.args = {
  events: [
    {
      start: new Date(2001, 0, 1, 1, 0, 0),
      end: new Date(2001, 0, 1, 5, 30, 0),
    },
    {
      start: new Date(2001, 0, 2, 2, 0, 0),
      end: new Date(2001, 0, 2, 6, 30, 0),
    },
  ],
  date: new Date(2001, 0, 1),
  daysToRender: 2,
};

export const RenderingASingleDay = Template.bind({});

RenderingASingleDay.args = {
  date: new Date(2000, 0, 1),
  daysToRender: 1,
  events: [
    {
      start: new Date(2000, 0, 1, 1, 0, 0),
      end: new Date(2000, 0, 1, 5, 30, 0),
    },
    {
      start: new Date(2000, 0, 1, 7, 0, 0),
      end: new Date(2000, 0, 1, 9, 30, 0),
    },
  ],
};

export const CreatingNewEvents: ComponentStory<typeof Calendar> = ({
  events: initialEvents = [],
  ...args
}) => {
  const [events, setEvents] = useState(initialEvents);

  return (
    <Calendar
      {...args}
      events={events}
      onEventCreate={({ end, start }) => {
        setEvents((events) => [...events, { start, end }]);
      }}
    />
  );
};

CreatingNewEvents.args = {
  date: new Date(2001, 0, 1),
};

export const ScrollToTime = Template.bind({});

ScrollToTime.parameters = {
  docs: {
    description: {
      story:
        "This will render the Calendar in the week of the `1st of January, 2001` and it will scroll to `07:30`",
    },
  },
};

ScrollToTime.args = {
  date: new Date(2001, 0, 1),
  scrollToTime: new Date(2001, 0, 1, 7, 30),
};

export const WeekDays = Template.bind({});

WeekDays.args = {
  daysToRender: 5,
  weekStartsOn: Calendar.MONDAY,
};

export const CustomLocales = Template.bind({});

CustomLocales.args = {
  locale: "fr",
};

CustomLocales.argTypes = {
  locale: { control: "select", options: ["fr", "en", "nl", "de"] },
};

export const CustomLocalesDateFns = Template.bind({});

CustomLocalesDateFns.parameters = {
  docs: {
    description: {
      story:
        "Any other valid locale from [date-fns](https://date-fns.org/v1.29.0/docs/I18n#supported-languages)\nThis example uses the Italian locale.",
    },
    source: {
      code: `
      import { it } from 'date-fns/locale';

<Calendar locale={it} />
      `,
    },
  },
};
CustomLocalesDateFns.args = {
  locale: it,
};

export const CustomStepSize = Template.bind({});

CustomStepSize.args = {
  step: 15,
};

export const CustomMinAndMaxTime = Template.bind({});

CustomMinAndMaxTime.args = {
  minTime: "06:00:00",
  maxTime: "17:00:00",
};

export const WithoutAHeader = Template.bind({});

WithoutAHeader.args = {
  renderHeader: () => null,
};

WithoutAHeader.parameters = {
  docs: {
    source: {
      code: "<Calendar renderHeader={() => null} />",
    },
  },
};

export const WithACustomHeader = Template.bind({});

WithACustomHeader.args = {
  renderHeader: ({ end, start }) => (
    <div
      style={{
        padding: 24,
        fontSize: 24,
        textAlign: "center",
        borderBottom: "1px solid #e0e0e0",
        fontWeight: "bold",
      }}
    >
      {start.toLocaleDateString()} - {end.toLocaleDateString()}
    </div>
  ),
};

WithACustomHeader.parameters = {
  docs: {
    source: {
      code: `
      <Calendar
  renderHeader={({ start, end }) => (
    <div
      style={{
        padding: 24,
        fontSize: 24,
        textAlign: "center",
        borderBottom: "1px solid #e0e0e0",
        fontWeight: "bold"
      }}
    >
      {start.toLocaleDateString()} - {end.toLocaleDateString()}
    </div>
  )}
/>`,
    },
  },
};

export const WithoutADayHeader = Template.bind({});

WithoutADayHeader.args = {
  renderDayHeader: () => null,
};

WithoutADayHeader.parameters = {
  docs: {
    source: {
      code: "<Calendar renderDayHeader={() => null} />",
    },
  },
};

export const WithoutAnyHeaders = Template.bind({});

WithoutAnyHeaders.args = {
  renderDayHeader: () => null,
  renderHeader: () => null,
};

WithoutAnyHeaders.parameters = {
  docs: {
    source: {
      code: "<Calendar renderDayHeader={() => null} renderHeader={() => null} />",
    },
  },
};

export const FullAdvancedExample: ComponentStory<typeof Calendar> = ({
  events: initialEvents = [],
  ...args
}) => {
  const [events, setEvents] = useState(initialEvents);

  return (
    <Calendar
      {...args}
      canCreateEvent={({ end, start }) => {
        // We don't allow overlapping events
        return !events.some((event) =>
          areIntervalsOverlapping({ start: event.start, end: event.end }, { start, end })
        );
      }}
      canUpdateEvent={({ end, event, start }) => {
        // We don't allow overlapping events
        return !events.some((storedEvent) => {
          if (storedEvent === event) {
            return false;
          }

          return areIntervalsOverlapping(
            { start: storedEvent.start, end: storedEvent.end },
            { start, end }
          );
        });
      }}
      events={events}
      onEventCreate={(event) => {
        args.onEventCreate(event);
        setEvents((events) => [...events, event]);
      }}
      onEventUpdate={({ end, event, start }) => {
        args.onEventUpdate({ event, start, end });

        setEvents((events) =>
          events.map((storedEvent) => {
            if (storedEvent === event) {
              return { ...storedEvent, start, end };
            }

            return storedEvent;
          })
        );
      }}
      renderDayHeader={({ date }) => (
        <div className="SkedifyCalendar__WeekHeader__Days__Day">{format(date, "iiii")}</div>
      )}
      renderEvent={({ event, interactionInfo: info }) => (
        <div
          style={{
            backgroundColor: "white",
            opacity: info.isInteracting ? 0.5 : 1,
            marginLeft: 1,
            marginRight: 1,
            color: "#282C34",
            boxShadow: "inset 0 0 0 2px #ccc",
            borderLeft: info.isUpdatingAllowed ? "4px solid #0541C8" : "4px solid #ED5454",
            padding: 10,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {format(event.start, "HH:mm")} {" - "}
          {format(event.end, "HH:mm")}
        </div>
      )}
      renderHeader={() => null}
      renderPlaceholder={({ event, interactionInfo: info }) => (
        <div
          style={{
            backgroundColor: info.isCreatingAllowed ? "#282C34" : "#ED5454",
            color: "white",
            boxShadow: "inset 0 0 0 2px #ccc",
            padding: 12,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {format(event.start, "HH:mm")} {" - "}
          {format(event.end, "HH:mm")}
        </div>
      )}
      scrollToTime={new Date(2001, 0, 1, 9, 30, 0)}
    />
  );
};

FullAdvancedExample.parameters = {
  docs: {
    description: {
      story: `
      In this example we will use a lot of of the available props.

      The things that you could do:

      - Create new events
      - Update existing events (resize + move)
      - Only rendering week days
      - Custom event rendering
      - Custom placeholder rendering
      - No main calendar header
      - Custom day headers
      - Not possible to create events that overlap (+ custom rendering)
      - Not possible to update events that overlap (+ custom rendering)
      - Scrolled to "09:30"

      <Sandbox>
      `,
    },
    source: {
      code: `
      <Calendar
        daysToRender={5}
        date={new Date(2001, 0, 1)}
        canCreateEvent={({ end, start }) => {
          // We don't allow overlapping events
          return !events.some((event) =>
            areIntervalsOverlapping({ start: event.start, end: event.end }, { start, end })
          );
        }}
        canUpdateEvent={({ end, event, start }) => {
          // We don't allow overlapping events
          return !events.some((storedEvent) => {
            if (storedEvent === event) {
              return false;
            }

            return areIntervalsOverlapping({ start: storedEvent.start, end: storedEvent.end }, { start, end })
          });
        }}
        events={events}
        onEventCreate={(event) => {
          args.onEventCreate(event);
          setEvents(events => [...events, event]);
        }}
        onEventUpdate={({ end, event, start }) => {
          args.onEventUpdate({ event, start, end });

          setEvents((events) => events.map((storedEvent) => {
              if (storedEvent === event) {
                return { ...storedEvent, start, end };
              }

              return storedEvent;
          }));
        }}
        renderDayHeader={({date}) => (
          <div className="SkedifyCalendar__WeekHeader__Days__Day">{format(date, "iiii")}</div>
        )}
        renderEvent={({event, interactionInfo: info }) => (
          <div
            style={{
              backgroundColor: "white",
              opacity: info.isInteracting ? 0.5 : 1,
              marginLeft: 1,
              marginRight: 1,
              color: "#282C34",
              boxShadow: "inset 0 0 0 2px #ccc",
              borderLeft: info.isUpdatingAllowed ? "4px solid #0541C8" : "4px solid #ED5454",
              padding: 10,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {format(event.start, "HH:mm")} {" - "}
            {format(event.end, "HH:mm")}
          </div>
        )}
        renderHeader={() => null}
        renderPlaceholder={({event, interactionInfo: info }) => (
          <div
            style={{
              backgroundColor: info.isCreatingAllowed ? "#282C34" : "#ED5454",
              color: "white",
              boxShadow: "inset 0 0 0 2px #ccc",
              padding: 12,
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {format(event.start, "HH:mm")} {" - "}
            {format(event.end, "HH:mm")}
          </div>
        )}
        scrollToTime={new Date(2001, 0, 1, 9, 30, 0)}
      />
      `,
    },
  },
};

FullAdvancedExample.args = {
  events: [],
  daysToRender: 5,
  date: new Date(2001, 0, 1),
};
