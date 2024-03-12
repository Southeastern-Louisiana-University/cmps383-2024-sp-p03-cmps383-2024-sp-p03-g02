import { useState, useEffect } from 'react';
import { Button} from 'react-bootstrap'
import { Link } from 'react-router-dom';
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
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);



  useEffect(() => {
    const currentMonth = today.toLocaleString('default', { month: 'long' });
    setSelectedMonth(currentMonth);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > 50) {
      setIsHeaderCollapsed(true);
    } else {
      setIsHeaderCollapsed(false);
    }
  };
  

  const cities = ['New Orleans', 'Hammond', 'Baton Rouge'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const housingPrices = [
    { city: 'New Orleans', prices: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160] },
    { city: 'Hammond', prices: [60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170] },
    { city: 'Baton Rouge', prices: [90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200] }
  ];

  const handleSearch = () => {
    console.log('Search with parameters:', {
      checkInDate,
      checkOutDate,
      numGuests,
      numRooms,
      selectedMonth,
      selectedCity
    });
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  function getNextDay(date: Date) {
    const nextDay = new Date(date);
    nextDay.setDate(date.getDate() + 1);
    return nextDay;
  }

  const monthsRow1 = months.slice(0, 6);
  const monthsRow2 = months.slice(6);

  return (
    <>
      <div className={`wrapper ${isHeaderCollapsed ? 'collapsed' : ''}`}>
        <div className="hotel-search-bar">
          <center>
            <h1>
              Welcome to EnStay!
            </h1>
            <DatePicker
            selected={checkInDate}
            onChange={(date) => setCheckInDate(date || today)}
            selectsStart
            startDate={checkInDate}
            endDate={checkOutDate}
            placeholderText="From"
          />
          <DatePicker
            selected={checkOutDate}
            onChange={(date) => setCheckOutDate(date || tomorrow)}
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
            <Button style={{ backgroundColor: '#FDBA74' }} onClick={handleSearch}> Search</Button>
          </Link>
          </center>
        </div>
      </div>

      
<center>
      <div className="discover">  
        <h2>Discover the best time to book your next stay</h2>
        <div className="wrapper2">
          <div className="city-buttons">
            {cities.map(city => (
              <button key={city} onClick={() => handleCitySelect(city)}>{city}</button>
            ))}
          </div>
          {selectedMonth && (
            <div className="wrapper">
              <div className='months-column'>
                {monthsRow1.map((month, index) => {
                  const selectedCityPrices = housingPrices.find(item => item.city === selectedCity)?.prices;
                  return (
                    <Link to="/hotels">
                    <button 
                      key={month} 
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month} - {selectedCityPrices ? `$${selectedCityPrices[index]}` : 'Price not available'}
                    </button>
                    </Link>
                  );
                })}
              </div>
              <div className='months-column'>
                {monthsRow2.map((month, index) => {
                  const selectedCityPrices = housingPrices.find(item => item.city === selectedCity)?.prices;
                  return (
                    <Link to="/hotels">
                    <button 
                      key={month} 
                      onClick={() => setSelectedMonth(month)}
                    >
                      {month} - {selectedCityPrices ? `$${selectedCityPrices[index + 6]}` : 'Price not available'}
                    </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
      </center>
    </>
  );
};

export default HotelSearchBar;