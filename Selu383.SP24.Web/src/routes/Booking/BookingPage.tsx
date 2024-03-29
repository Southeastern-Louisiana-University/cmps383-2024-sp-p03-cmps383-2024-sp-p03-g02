import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";


interface User {
  id: number;
  userName: string;
}

interface RoomDto{
  id: number;
  hotelId?: number;
  rTypeId?: number;
  rate?: number;
  roomNumber?: number;
  image?: string;
  roomType?: {
    id: number;
    name: string;
    commonItems: string;
  };
}

const BookingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [room, setRoom] = useState<RoomDto>();
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/authentication/me');
        if (!response.ok) {
          throw new Error(`Failed to fetch current user. Status: ${response.status}`);
        }
        const currentUserData: User = await response.json();
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const roomResponse = await fetch(`/api/rooms/${id}`);
        if (!roomResponse.ok) {
          throw new Error(
            `Failed to fetch hotel details. Status: ${roomResponse.status}`
          );
        }
          const roomData = await roomResponse.json();
          setRoom(roomData);
      } catch(error){
        console.error(error);
      }
    };
    fetchRoomDetails();
  },[id])

  return (
    <Container
      className="mt-4"
      style={{
        border: "1px solid #dddddd",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 0 10px #FDBA74",
      }}
    >
      <h2>This is a booking page</h2>
      {currentUser && (
        <div>
           <p>Welcome, {currentUser.userName}!</p>
           {room?.roomType?.name}
           <br></br>
           <input
            value={`${format(range[0].startDate, "MM/dd/yyyy")} to ${format(
              range[0].endDate,
              "MM/dd/yyyy"
              )}`}
            readOnly
            className="inputBox"
            onClick={() => setOpen((open) => !open)}
          />
          {open && (
              <DateRange
                onChange={(ranges) => {
                  const startDate = ranges.selection?.startDate ?? new Date(); // Provide a default value if startDate is undefined
                  const endDate = ranges.selection?.endDate ?? addDays(new Date(), 7); // Provide a default value if endDate is undefined
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
          <p>${room?.rate} per night</p>
          <p>Amenities: {room?.roomType?.commonItems}</p>
          <Button style={{ backgroundColor: '#FDBA74' }} className="btn-light">Confirm</Button>
        </div>
        
        
      )}
    </Container>
  );
};

export default BookingPage;
