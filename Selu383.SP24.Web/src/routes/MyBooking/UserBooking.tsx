import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

interface UserDto {
  id: number;
  userName: string;
}

interface HotelDto {
  id: number;
  name: string;
}

interface RoomDto {
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
  hotel?: HotelDto; 
}

interface ReservationDto {
  id: number;
  hotelId: number;
  roomId: number;
  room: RoomDto;
  checkInDate: Date;
  checkOutDate: Date;
  userId?: number;
  user?: UserDto;
}

function UserBooking() {
  const [bookings, setBookings] = useState<ReservationDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(`/api/reservations/myBookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
      }
    }

    fetchBookings();
  }, []);

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
      <h1
        className="text-center mb-4"
        style={{
          fontWeight: "bold",
          color: "#000000",
          textShadow: "2px 2px 5px #FDBA74",
        }}
      >
        Bookings
      </h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Row key={booking.id}>
            <Col>
              <Card>
                <Card.Body>

                  <Card.Text>
                    <center>
                        <strong>Hotel Name:</strong>{" "}
                        {booking.room.hotel ? booking.room.hotel.name : "Unknown"}
                        <br />
                        <strong>Room Type:</strong>{" "}
                        {booking.room.roomType ? booking.room.roomType.name : "Unknown"}
                        <br />
                        <img
                        src={booking.room.image}
                        alt="Room"
                        style={{ maxWidth: "50%", height: "50%" }}
                        />
                        <br />
                        <strong>Check-In Date:</strong>{" "}
                        {new Date(booking.checkInDate).toLocaleDateString()}
                        <br />
                        <strong>Check-Out Date:</strong>{" "}
                        {new Date(booking.checkOutDate).toLocaleDateString()}
                        <br />                        
                    </center>

                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <p>No bookings found</p>
      )}
      {error && <div className="error-message">{error}</div>}
    </Container>
  );
}

export default UserBooking;
