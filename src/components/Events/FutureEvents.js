import React from "react";
import "./Events.scss";

export default function FutureEvents({
  futureEvents,
  showGrid,
  mappingGrid,
  mappingRows,
}) {
  let eventList;
  if (futureEvents) {
    if (showGrid) {
      eventList = futureEvents.map(mappingGrid);
    } else {
      eventList = futureEvents.map(mappingRows);
    }
  } else {
    return <div></div>;
  }
  return eventList;
}
