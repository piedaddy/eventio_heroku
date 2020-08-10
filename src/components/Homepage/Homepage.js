import React, { useState, useEffect } from "react";
import PastEvents from "../Events/PastEvents";
import FutureEvents from "../Events/FutureEvents";
import HomepageHeader from "../Header/HomepageHeader";
import EventButton from "../EventButton/EventButton";
import GridSVG from "../SVG/GridSVG";
import ListSVG from "../SVG/ListSVG";
import PeopleSVG from "../SVG/PeopleSVG";
import { useLocation } from "react-router";
import { Link, useHistory } from "react-router-dom";
import moment from "moment";
import "./Homepage.scss";
import "../Events/Events.scss";

export default function Homepage({ userInfo, authToken }) {
  const [eventList, setEventList] = useState([]);
  const [userID, setUserID] = useState(null);

  const [firstInitial, setFirstInitial] = useState("");
  const [lastInitial, setLastInitial] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [showPast, setShowPast] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  const [futureEvents, setFutureEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [isFromHome, setIsFromHome] = useState(true);
  let todayDate = moment().format();
  let location = useLocation();
  let history = useHistory();
  let userEvents, list, time, date;
  const eventListUrl = "https://testproject-api-v2.strv.com/events";

  const getEventList = async (e) => {
    const response = await fetch(eventListUrl, {
      method: "GET",
      headers: {
        APIKey: "a44883edde409d11fc9fca4b4c028b311ea4cabc",
        "Content-type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]'),
      },
    });
    const data = await response.json();
    setEventList(data);
  };

  useEffect(() => {
    setStates();
    getEventList();
    getUserEventList();
  }, []);

  const setStates = async () => {
    setUserID(location.state.userInfo.id);
    setFirstInitial(location.state.userInfo.firstName.charAt(0).toUpperCase());
    setLastInitial(location.state.userInfo.firstName.charAt(0).toUpperCase());
  };

  const getUserEventList = () => {
    userEvents = eventList.filter((event) => event.owner.id === userID);
    eventList.map((event) => {
      event.attendees.map((attendee) => {
        if (userID === attendee.id) {
          userEvents.push(event);
        }
      });
    });
  };

  const getPastEventList = () => {
    setShowAll(false);
    setShowFuture(false);
    setShowPast(true);
    setPastEvents(eventList.filter((event) => event.startsAt < todayDate));
  };

  const getFutureEventList = () => {
    setShowAll(false);
    setShowFuture(true);
    setShowPast(false);
    setFutureEvents(eventList.filter((event) => event.startsAt > todayDate));
  };

  const getAllEventList = () => {
    setShowAll(true);
    setShowFuture(false);
    setShowPast(false);
    getEventList();
  };

  function handleShowUserProfile() {
    getUserEventList();
    history.push({
      pathname: "/profile",
      state: {
        userInfo: location.state.userInfo,
        authToken: location.state.authToken,
        userEventList: userEvents,
        firstInitial: firstInitial,
        lastInitial: lastInitial,
        isFromHome: isFromHome,
      },
    });
  }

  function handleEventGridStyle() {
    setShowGrid(true);
  }
  function handleEventListStyle() {
    setShowGrid(false);
  }

  if (showGrid) {
    list = eventList.map(mappingGrid);
  } else {
    list = eventList.map(mappingRows);
  }

  function mappingGrid(event, index) {
    let totalPeople;
    let count = 0;
    let eventStartAt = event.startsAt;
    let isUserAttending = false;
    let isUserOwner = false;
    date = moment(eventStartAt).format("MMMM Do, YYYY");
    time = moment(eventStartAt).format("h:mm a");
    event.attendees.map((attendee) => {
      if (attendee.id === userID) {
        isUserAttending = true;
      }
      count += 1;
    });
    if (event.owner.id === userID) {
      isUserOwner = true;
    }
    count === 0 ? (totalPeople = 0) : (totalPeople = event.capacity - count);
    return (
      <div key={index} className="event_list">
        <div className="event_time">
          {date} - {time}
        </div>
        <div className="event_names">
          <div className="event_title">
            <h3>{event.title}</h3>
          </div>
          <div className="event_owner">
            {event.owner.firstName} {event.owner.lastName}
          </div>
        </div>
        <p className="event_description">{event.description}</p>
        <div className="event_list_bottom-row">
          <div className="event_capacity">
            <div>
              <PeopleSVG />
            </div>
            {totalPeople} of {event.capacity}
          </div>
          <EventButton
            isUserAttending={isUserAttending}
            isUserOwner={isUserOwner}
            userID={location.state.userInfo.id}
            auth={location.state.authToken}
            eventID={event.id}
            userInfo={location.state.userInfo}
            userEventList={userEvents}
            firstInitial={firstInitial}
            lastInitial={lastInitial}
            isFromHome={isFromHome}
            setIsFromHome={setIsFromHome}
            getEventList={getEventList}
          />
        </div>
      </div>
    );
  }

  function mappingRows(event, index) {
    let isUserAttending = false;
    let isUserOwner = false;
    let eventStartAt = event.startsAt;
    let count = 0;
    let totalPeople;
    let shortDescription = event.description;
    console.log(event.description.length);
    if (event.description.length > 40) {
      shortDescription = event.description.slice(0, 30).concat("...");
    }
    date = moment(eventStartAt).format("MMMM Do, YYYY");
    time = moment(eventStartAt).format("h:mm a");
    event.attendees.map((attendee) => {
      if (attendee.id === userID) {
        isUserAttending = true;
      }
      count += 1;
    });
    if (event.owner.id === userID) {
      isUserOwner = true;
    }
    count === 0 ? (totalPeople = 0) : (totalPeople = event.capacity - count);
    return (
      <div key={index} className="event_list_rows">
        <div className="event_title">
          <h3>{event.title}</h3>
        </div>
        <div className="event_description_rows">
          <p>{shortDescription}</p>
        </div>
        <div className="event_owner">
          {event.owner.firstName} {event.owner.lastName}
        </div>
        <div className="event_time">
          {date} - {time}
        </div>
        <div className="bottom-row">
          <div className="event_capacity_rows">
            {totalPeople} of {event.capacity}
          </div>
          <div className="event_column_button">
            <EventButton
              isUserAttending={isUserAttending}
              isUserOwner={isUserOwner}
              userID={location.state.userInfo.id}
              auth={location.state.authToken}
              eventID={event.id}
              userInfo={location.state.userInfo}
              userEventList={userEvents}
              firstInitial={firstInitial}
              lastInitial={lastInitial}
              isFromHome={isFromHome}
              setIsFromHome={setIsFromHome}
              getEventList={getEventList}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="homepage">
      <div>
        <HomepageHeader
          firstName={location.state.userInfo.firstName}
          lastName={location.state.userInfo.lastName}
          firstInitial={firstInitial}
          lastInitial={lastInitial}
          handleShowUserProfile={handleShowUserProfile}
          authToken={location.state.authToken}
          eventList={eventList}
          userID={location.state.userInfo.id}
        />
        <div className="homepage_nav">
          <div className="homepage_nav__buttons">
            <button onClick={getAllEventList}>ALL EVENTS</button>
            <button onClick={getPastEventList}>PAST EVENTS</button>
            <button onClick={getFutureEventList}>FUTURE EVENTS</button>
          </div>
          <div className="display_icons">
            <div className={`${showGrid ? "active" : ""}`}>
              <GridSVG handleEventGridStyle={handleEventGridStyle} />
            </div>
            <div className={`${!showGrid ? "active" : ""}`}>
              <ListSVG handleEventListStyle={handleEventListStyle} />
            </div>
          </div>
        </div>

        <div className="event_list_container">
          {showGrid ? (
            <div className="event_list_grid_container">
              {location !== null && showAll ? list : ""}
              {location !== null && showFuture ? (
                <FutureEvents
                  futureEvents={futureEvents}
                  showGrid={showGrid}
                  mappingGrid={mappingGrid}
                />
              ) : (
                ""
              )}
              {location !== null && showPast ? (
                <PastEvents
                  pastEvents={pastEvents}
                  showGrid={showGrid}
                  mappingGrid={mappingGrid}
                />
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="event_list_rows_container">
              {location !== null && showAll ? list : ""}
              {location !== null && showFuture ? (
                <FutureEvents
                  futureEvents={futureEvents}
                  showGrid={showGrid}
                  mappingColumn={mappingRows}
                />
              ) : (
                ""
              )}
              {location !== null && showPast ? (
                <PastEvents
                  pastEvents={pastEvents}
                  mappingColumn={mappingRows}
                />
              ) : (
                ""
              )}
            </div>
          )}
        </div>

        <Link
          to={{
            pathname: "/event/add",
            state: {
              userInfo: location.state.userInfo,
              authToken: location.state.authToken,
            },
          }}
          className="add_event_link"
        >
          <button className="add_event_button">
            <p>+</p>
          </button>
        </Link>
      </div>
    </div>
  );
}
