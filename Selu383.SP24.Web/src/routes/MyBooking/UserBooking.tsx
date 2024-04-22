import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

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
  const [buttonColors, setButtonColors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await fetch(`/api/reservations/myBookings`);
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        // Retrieve button colors from localStorage if available, otherwise initialize to "success"
        const storedButtonColors = JSON.parse(localStorage.getItem("buttonColors") || "{}");
        setButtonColors(storedButtonColors);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError("Failed to fetch bookings. Please try again.");
      }
    }

    fetchBookings();
  }, []);

  const handleButtonClick = (bookingId: number) => {
    setButtonColors(prevButtonColors => {
      const newButtonColors = {
        ...prevButtonColors,
        [bookingId]: prevButtonColors[bookingId] === "success" ? "danger" : "success"
      };
      localStorage.setItem("buttonColors", JSON.stringify(newButtonColors));
      return newButtonColors;
    });
  };

  const cancelReservation = async (id: number) => {
    try {
      const response = await fetch(`/api/cancelReservation/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer your_access_token_here"
        }
      });
      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }
      // Remove the cancelled reservation from the UI
      setBookings(prevBookings => prevBookings.filter(booking => booking.id !== id));
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setError("Failed to cancel reservation. Please try again.");
    }
  };

  

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
              <Card
                style={{
                  border: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Img
                  variant="top"
                  src={booking.room.image || "https://imgur.com/EwexnIp.png"}
                  alt="Room"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
                <Card.Body>
                  <Card.Title style={{ color: "#000000", textShadow: "2px 2px 5px #FFA500" }}>
                    <strong>Hotel Name:</strong>{" "}
                    {booking.room.hotel ? booking.room.hotel.name : "Unknown"}
                  </Card.Title>
                  <Card.Text  style={{ color: "#000000", textShadow: "2px 2px 5px #FFA500" }}>
                    <strong>Room Type:</strong>{" "}
                    {booking.room.roomType
                      ? booking.room.roomType.name
                      : "Unknown"}
                    <br />
                    <strong>Room Number:</strong>{" "}
                    {booking.room.roomNumber}
                    <br />
                    <strong>Check-In Date:</strong>{" "}
                    {new Date(booking.checkInDate).toLocaleDateString()}
                    <br />
                    <strong>Check-Out Date:</strong>{" "}
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </Card.Text>
                  <Button
                    variant={buttonColors[booking.id] || "danger"} 
                    onClick={() => handleButtonClick(booking.id)}
                    style={{ width: "10%" }}
                  >
                    {buttonColors[booking.id] === "success" ? "Unlocked" : "Locked"}
                  </Button>
                  <Button onClick={() => cancelReservation(booking.id)}>Cancel Reservation</Button>
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
