import React, { useState } from "react";
import ReactDOM from "react-dom";
import { format } from "date-fns";

import Calendar from "./components/Calendar/Calendar";
import { IEvent } from "./types";

import "./index.css";

function CalendarExample() {
  const [events, setEvents] = useState<IEvent[]>([]);

  return (
    <Calendar
      canCreateEvent={({ end, start }) => {
        // We don't allow overlapping event
        return true;
        // return !events.some((event) => areRangesOverlapping(event.start, event.end, start, end));
      }}
      canUpdateEvent={({ end, event, start }) => {
        // We don't allow overlapping events
        return !events.some((storedEvent) => {
          if (storedEvent === event) {
            return false;
          }

          return false;
          // return areRangesOverlapping(storedEvent.start, storedEvent.end, start, end);
        });
      }}
      date={new Date(2001, 0, 1)}
      daysToRender={5}
      events={events}
      onEventClick={(event) => console.log("onEventClick", event)}
      onEventCreate={(event) => {
        setEvents((events) => [...events, event]);
      }}
      onEventUpdate={({ end, event, start }) => {
        console.log("onEventUpdate", { event, start, end });

        setEvents((events) => {
          return events.map((storedEvent) => {
            if (storedEvent === event) {
              console.log("updating: ", event);

              return { ...storedEvent, start, end };
            }

            return storedEvent;
          });
        });
      }}
      renderDayHeader={({ date }) => (
        <div className="SkedifyCalendar__WeekHeader__Days__Day">{format(date, "dddd")}</div>
      )}
      renderEvent={({ event, interactionInfo }) => (
        <div
          style={{
            backgroundColor: "white",
            opacity: interactionInfo.isInteracting ? 0.5 : 1,
            marginLeft: 1,
            marginRight: 1,
            color: "#282C34",
            boxShadow: "inset 0 0 0 2px #ccc",
            borderLeft: interactionInfo.isUpdatingAllowed
              ? "4px solid #0541C8"
              : "4px solid #ED5454",
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
}

ReactDOM.render(
  <React.StrictMode>
    <CalendarExample />
  </React.StrictMode>,
  document.getElementById("root")
);
