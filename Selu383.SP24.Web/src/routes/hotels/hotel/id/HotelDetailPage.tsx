import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
  email?: string;
  locationId: number;
}

interface CityDto {
  name?: string;
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
}

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [city, setCity] = useState<CityDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rooms, setRooms] = useState<RoomDto[]>([]);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const hotelResponse = await fetch(`/api/hotels/${id}`);
        if (!hotelResponse.ok) {
          throw new Error(
            `Failed to fetch hotel details. Status: ${hotelResponse.status}`
          );
        }
        const hotelData: HotelDto = await hotelResponse.json();
        setHotel(hotelData);

        const roomResponse = await fetch(`/api/hotels/${id}/rooms`);
        if (!roomResponse.ok) {
          throw new Error(
            `Failed to fetch room details. Status: ${roomResponse.status}`
          );
        }
        const roomData: RoomDto[] = await roomResponse.json();
        setRooms(roomData);

        const cityResponse = await fetch(`/api/cities/${hotelData.locationId}`);
        if (!cityResponse.ok) {
          throw new Error(
            `Failed to fetch city details. Status: ${cityResponse.status}`
          );
        }
        const cityData: CityDto = await cityResponse.json();
        setCity(cityData);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError("Failed to fetch hotel details. Please try again.");
      }
    };

    fetchHotelDetails();
  }, [id]);

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
      {hotel && (
        <div>
          <h1
            className="text-center"
            style={{
              fontWeight: "bold",
              color: "#000000",
              textShadow: "2px 2px 5px #FDBA74",
            }}
          >
            {hotel.name}
          </h1>
          <Row className="justify-content-center">
            {rooms.map((room) => (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={room.id}>
                <Link to={`/booking/${room.id}`} style={{ textDecoration: 'none' }}>
                <Card
                  style={{ width: "100%", textAlign: "center", boxShadow: "0 0 10px #FDBA74" }}
                >
                  <Card.Img
                    variant="top"
                    src={room.image}
                    alt="Room Placeholder"
                    style={{ width: "100%" }}
                  />
                  <Card.Body>
                    <Card.Title>{room.roomType?.name}</Card.Title>
                    <Card.Text>
                      <strong>Rate: ~$</strong>{room.rate}
                    </Card.Text>
                    <Card.Text>
                      <strong>Amneties:</strong> {room.roomType?.commonItems}
                    </Card.Text>
                  </Card.Body>
                </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <Row className="mt-4 justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <p>
                <strong>Address:</strong> {hotel.address}
              </p>
              <p>
                <strong>Description:</strong> Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Nulla condimentum tortor vel orci
                placerat, nec feugiat dui posuere. In hac habitasse platea
                dictumst. Nulla facilisi. Sed euismod nisl vel magna vehicula,
                ut egestas elit vestibulum.
              </p>
              <p>
                <strong>Contact Email: </strong>
                {hotel.email}
              </p>
              <p>
                <strong>City: </strong>
                {city?.name}
              </p>
              <Link to="/hotels" className="btn btn-warning" style={{ backgroundColor: "#FDBA74" }}>
                Back
              </Link>
            </Col>
          </Row>
        </div>
      )}

      {/* Error message if there's an issue fetching hotel details */}
      {error && <div className="error-message">{error}</div>}
    </Container>
  );
};

export default HotelDetailsPage;
