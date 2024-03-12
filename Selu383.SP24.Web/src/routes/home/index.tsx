import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/home.css";

import { DateRange } from "react-date-range";

import format from "date-fns/format";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const HotelSearchBar = () => {
  const today = new Date();
  const tomorrow = getNextDay(today);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);

  const handleSearch = () => {
    console.log("Search with parameters:", {
      checkInDate,
      checkOutDate,
      numGuests,
      numRooms,
    });
  };

  function getNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
  }

  // date state
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  // open close
  const [open, setOpen] = useState(false);

  // get the target element to toggle
  const refOne = useRef(null);

  return (
    <>
      <div className="wrapper">
        <center>
          <h1>Welcome to EnStay!</h1>
        </center>
      </div>

      <div className="wrapper">
        <div className="hotel-search-bar">
          <input
            value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
              range[0].endDate,
              "MM/dd/yyyy"
            )}`}
            readOnly
            className="inputBox"
            onClick={() => setOpen((open) => !open)}
          />

          <div ref={refOne}>
            {open && (
              <DateRange
                onChange={(ranges) => {
                  const startDate = ranges.selection.startDate ?? new Date(); // Ensure startDate is not undefined
                  const endDate =
                    ranges.selection.endDate ?? addDays(new Date(), 7); // Ensure endDate is not undefined
                  setRange([{ startDate, endDate, key: "selection" }]);
                }}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                className="calendarElement"
                minDate={new Date()} // Prevent selection of dates before today
              />
            )}
          </div>
          <select
            value={numGuests}
            onChange={(e) => setNumGuests(parseInt(e.target.value))}
          >
            {[...Array(10).keys()].map((num) => (
              <option key={num} value={num + 1}>
                {num + 1} Guest(s)
              </option>
            ))}
          </select>
          <select
            value={numRooms}
            onChange={(e) => setNumRooms(parseInt(e.target.value))}
          >
            {[...Array(5).keys()].map((num) => (
              <option key={num} value={num + 1}>
                {num + 1} Room(s)
              </option>
            ))}
          </select>
          <Link to="/hotels">
            <button onClick={handleSearch}>Search</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HotelSearchBar;
