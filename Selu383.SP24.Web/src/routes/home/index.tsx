import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import '../../styles/home.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/home.css';

const HotelSearchBar = () => {
  const today = new Date();
  const tomorrow = getNextDay(today);
  const [checkInDate, setCheckInDate] = useState(today);
  const [checkOutDate, setCheckOutDate] = useState(tomorrow);
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);

  const handleSearch = () => {
    // Handle search functionality here
    console.log('Search with parameters:', {
      checkInDate,
      checkOutDate,
      numGuests,
      numRooms
    });
  };

  function getNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
  }

  return (
    <>
    <div className="wrapper">
      <center><h1>Welcome to EnStay!</h1>
      </center>
    </div>

    <div className="wrapper">
    <div className="hotel-search-bar">
      <DatePicker
        selected={checkInDate}
        onChange={date => setCheckInDate(date || today)}
        selectsStart
        startDate={checkInDate}
        endDate={checkOutDate}
        placeholderText="From"
      />
      <DatePicker
        selected={checkOutDate}
        onChange={date => setCheckOutDate(date || tomorrow)}
        selectsEnd
        startDate={checkInDate}
        endDate={checkOutDate}
        minDate={checkInDate}
        placeholderText="To"
      />
      <select
        value={numGuests}
        onChange={(e) => setNumGuests(parseInt(e.target.value))}
      >
        {[...Array(10).keys()].map(num => (
          <option key={num} value={num+1}>{num+1} Guest(s)</option>
        ))}
      </select>
      <select
        value={numRooms}
        onChange={(e) => setNumRooms(parseInt(e.target.value))}
      >
        {[...Array(5).keys()].map(num => (
          <option key={num} value={num+1}>{num+1} Room(s)</option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
    </div>
      <div className="wrapper">
      <center>
        <Link to="/hotels">
        <Button variant="primary">Go to Hotels</Button>
      </Link></center>
      </div>
    </>
  );
}
export default HotelSearchBar;
