import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

interface UserDto {
  id: number;
  userName: string;
}

interface HotelDto {
  id: number;
  name: string;
  address: string;
  managerId: number;
  email: string;
  contactNumber: string;
  image: string;
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
      }
    }

    fetchBookings();
  }, []);

  return (
    <Container>
      <h1>All Bookings</h1>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <Row key={booking.id}>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title>Reservation ID: {booking.id}</Card.Title>
                  <Card.Text>
                    <strong>Hotel Name:</strong>{" "}
                    {booking.room.hotel ? booking.room.hotel.name : "Unknown"}
                    <br />
                    <strong>Room Type:</strong>{" "}
                    {booking.room.roomType ? booking.room.roomType.name : "Unknown"}
                    <br />
                    <img
                      src={booking.room.image}
                      alt="Room"
                      style={{ maxWidth: "100%", height: "auto" }}
                    />
                    <br />
                    <strong>Check-In Date:</strong>{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                    <br />
                    <strong>Check-Out Date:</strong>{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                    <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      ) : (
        <p>No bookings found</p>
      )}
    </Container>
  );
}

export default UserBooking;
