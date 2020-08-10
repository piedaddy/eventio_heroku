import React from "react";
import "./Events.scss";

export default function PastEvents({
  showGrid,
  pastEvents,
  mappingGrid,
  mappingRows,
}) {
  let eventList;
  if (pastEvents) {
    if (showGrid) {
      eventList = pastEvents.map(mappingGrid);
    } else {
      eventList = pastEvents.map(mappingRows);
    }
  }
  return (
    <div>
      {eventList.length === 0 ? (
        <div className="empty_past_event_message">
          <p>There are no past events!</p>
        </div>
      ) : (
        eventList
      )}
    </div>
  );
}
