import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button} from 'react-bootstrap'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/home.css";

import { DateRange } from "react-date-range";

import format from "date-fns/format";
import { addDays } from "date-fns";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface RoomDto {
  id: number;
  hotelId: number;
  rate: number;
  roomNumber: number;
  image: string;
  rTypeId: number;
  roomType: RTypeDto;
}

interface RTypeDto {
  id: number;
  name: string;
  description: string;
}


const HotelSearchBar = () => {
  const today = new Date();
  const tomorrow = getNextDay(today);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  const [searchResults, setSearchResults] = useState<Array<RoomDto>>([]);
  
  const handleReservation = async (room: RoomDto) => {
    const reservationData = {
      roomId: room.id,
      hotelId: room.hotelId,
      checkInDate: format(range[0].startDate, "yyyy-MM-dd"),
      checkOutDate: format(range[0].endDate, "yyyy-MM-dd")
    };
  
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      });
  
      if (response.ok) {
        alert("Room reserved successfully!");
      } else {
        const responseData = await response.json();
        alert(`Failed to reserve room: ${response.status} - ${response.statusText}. ${responseData.message}`);
      }
    } catch (error) {
      alert("Failed to reserve room. Please try again later.");
      console.error("Reservation error:", error);
    }
  };
  

  const handleSearch = async () => {
    const url = `/api/rooms/available?selectedDate=${format(range[0].startDate, "yyyy-MM-dd")}&numGuests=${numGuests}`;
    console.log(url);
    const response = await fetch(url);
    if (response.ok) {
      const availableRooms: Array<RoomDto> = await response.json();
      setSearchResults(availableRooms);
    } else {
      console.error('Failed to fetch available rooms');
    }
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

  const [open, setOpen] = useState(false);

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
                  const startDate = ranges.selection.startDate ?? new Date(); 
                  const endDate =
                    ranges.selection.endDate ?? addDays(new Date(), 7); 
                  setRange([{ startDate, endDate, key: "selection" }]);
                }}
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                ranges={range}
                months={1}
                direction="horizontal"
                className="calendarElement"
                minDate={new Date()} 
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
          <Button style={{ backgroundColor: '#FDBA74' }} onClick={handleSearch}>Search</Button>
        </div>
      </div>

      <div className="wrapper">
        <h2>Search Results:</h2>
        <ul>
          {searchResults.map(room => (
            <li key={room.id}>
              Hotel ID: {room.hotelId}, Room Number: {room.roomNumber}, Rate: {room.rate}
              <button onClick={() => handleReservation(room)}>Reserve</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default HotelSearchBar;
