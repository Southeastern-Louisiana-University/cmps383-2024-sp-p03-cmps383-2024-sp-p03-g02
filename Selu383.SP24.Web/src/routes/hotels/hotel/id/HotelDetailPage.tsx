import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
  email?: string;
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

interface RTypeDto {
  id: number;
  name: string;
  description: string;
  capacity: number;
  commonItems: string;
}

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roomTypes, setRoomTypes] = useState<RTypeDto[]>([]);

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

        const roomTypeResponse = await fetch(`/api/rooms/rtype/${id}`);
        if (!roomTypeResponse.ok) {
          throw new Error(
            `Failed to fetch room details. Status: ${roomTypeResponse.status}`
          );
        }
        const roomTypeData: RTypeDto[] = await roomTypeResponse.json();
        setRoomTypes(roomTypeData);

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
            {roomTypes.map((roomType) => (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={roomType.id}>
                <Link to={`/create-booking/${hotel.id}/${roomType.id}`} style={{ textDecoration: 'none', color: '#000' }}>
                <Card
                  style={{ width: "100%", textAlign: "center", boxShadow: "0 0 10px #FDBA74" }}
                >
                  <Card.Img
                    variant="top"
                    src="https://i.imgur.com/g4pv8fd.jpeg"
                    alt="Room Placeholder"
                    style={{ width: "100%" }}
                  />
                  <Card.Body>
                    <Card.Title>{roomType.name}</Card.Title>
                    <Card.Text>
                      <strong>Amneties:</strong> {roomType.commonItems}
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
