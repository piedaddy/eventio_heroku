import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import HomepageHeader from "../Header/HomepageHeader";
import EventButton from "../EventButton/EventButton";
import "./User.scss";
import "../Events/Events.scss";
import "../Homepage/Homepage.scss";
import GridSVG from "../SVG/GridSVG";
import ListSVG from "../SVG/ListSVG";
import PeopleSVG from "../SVG/PeopleSVG";
import moment from "moment";

export default function UserProfile({
  userInfo,
  authToken,
  userEventList,
  firstInitial,
  lastInitial,
  isFromHome,
}) {
  const [showGrid, setShowGrid] = useState(true);
  let location = useLocation();
  let firstI = location.state.firstInitial;
  let lastI = location.state.lastInitial;
  let firstName = location.state.userInfo.firstName;
  let lastName = location.state.userInfo.lastName;
  let email = location.state.userInfo.email;
  let userEvents = location.state.userEventList;
  let userID = location.state.userInfo.id;
  let auth = location.state.authToken;
  let eventsGrid, eventsList;
  let time, date;

  if (location.state.userEventList) {
    eventsGrid = userEvents.map(mappingGrid);
  }
  if (location.state.userEventList) {
    eventsList = userEvents.map(mappingRows);
    console.log(eventsList);
  }

  function handleShowGrid() {
    setShowGrid(true);
  }
  function handleShowList() {
    setShowGrid(false);
  }

  function mappingGrid(event, index) {
    let isUserAttending = false;
    let isUserOwner = false;
    let count = 0;
    let totalPeople;
    let eventStartAt = event.startsAt;
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
            userID={userID}
            userEventList={location.state.userEventList}
            auth={location.state.authToken}
            userInfo={location.state.userInfo}
            firstInitial={location.state.firstInitial}
            lastInitial={location.state.lastInitial}
            eventID={event.id}
            isFromHome={location.state.isFromHome}
          />
        </div>
      </div>
    );
  }

  function mappingRows(event, index) {
    let isUserAttending = false;
    let isUserOwner = false;
    let count = 0;
    let totalPeople;
    let eventStartAt = event.startsAt;
    let shortDescription = event.description;
    if (event.description.length > 40)
      shortDescription = event.description.slice(0, 30).concat("...");
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
              userID={userID}
              userEventList={location.state.userEventList}
              auth={location.state.authToken}
              userInfo={location.state.userInfo}
              firstInitial={location.state.firstInitial}
              lastInitial={location.state.lastInitial}
              eventID={event.id}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {location !== null ? (
        <div className="user_profile">
          <HomepageHeader
            firstName={firstName}
            lastName={lastName}
            firstInitial={firstI}
            lastInitial={firstI}
            userInfo={location.state.userInfo}
            authToken={auth}
          />
          <div className="user_profile__banner">
            <div className="user_profile__info">
              <div className="circle">
                <span>
                  {firstI}
                  {lastI}
                </span>
              </div>
              <div className="user_profile__info info">
                <p>
                  {firstName} {lastName}
                </p>
                <p>{email}</p>
              </div>
            </div>
          </div>

          {/* <div className="user_profile_events"> */}
          <div className="user_profile__events">
            <span>My events</span>
            <div className="display_icons">
              {/* <div className="grid_icon"> */}
              <div className={`${showGrid ? "active" : ""}`}>
                <GridSVG handleEventGridStyle={handleShowGrid} />
              </div>
              {/* <div className="list_icon"> */}
              <div className={`${!showGrid ? "active" : ""}`}>
                <ListSVG handleEventListStyle={handleShowList} />
              </div>
            </div>
          </div>
          <div className="event_list_container">
            {showGrid ? (
              <div className="event_list_grid_container"> {eventsGrid}</div>
            ) : (
              <div className="event_list_rows_container">{eventsList} </div>
            )}
          </div>
        </div>
      ) : (
        // </div>
        ""
      )}
    </>
  );
}
