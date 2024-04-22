import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";



interface HotelDto {
  id: number;
  name: string;
  address: string;
  email: string;
}

const HotelSearchBar: React.FC = () => {
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels");
        if (!response.ok) {
          throw new Error(`Failed to fetch hotels. Status: ${response.status}`);
        }
        const data: HotelDto[] = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Failed to fetch hotels. Please try again.");
      }
    };

    fetchHotels();
  }, []);

  return (

        <Container className="mt-4"
      style={{
        border: "1px solid #dddddd",
        borderRadius: "8px",
        padding: "20px",
        boxShadow: "0 0 10px #FDBA74",
      }}>
          <h1
            className="text-center mb-4"
            style={{
              fontWeight: "bold",
              color: "#000", 
              textShadow: "2px 2px 5px #FDBA74",
            }}
          >
            Welcome to EnStay
          </h1>
          <Row className="justify-content-center">
            {hotels.map((hotel) => (
              <Col xs={12} sm={6} md={4} lg={3} className="mb-3" key={hotel.id}>
                <Link
                  to={`/hotels/${hotel.id}`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <Card style={{ boxShadow: "0 0 10px #FDBA74" }}>
                    <Card.Img
                      variant="top"
                      src="https://i.imgur.com/g4pv8fd.jpeg"
                      alt="Hotel Image"
                    />
                    <Card.Body>
                      <Card.Title>{hotel.name}</Card.Title>
                      <Card.Text>
                        <strong>Address:</strong> {hotel.address}
                        <br />
                        <strong>Contact Email:</strong> {hotel.email}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={8} className="mt-4">
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  color: "#000",
                  textShadow: "2px 2px 5px #FDBA74",
                }}
              >
                EnStay prides itself on its key-less, contactless unlocking and
                locking system that utilizes a mobile app. Our innovative system
                provides convenience and security for our guests, allowing them
                to seamlessly access their rooms without the need for physical
                keys. Experience a hassle-free stay with EnStay.
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center mt-4">
            <Col xs={12} md={6} className="text-center">
              <img
                src="https://i.imgur.com/69gqyU0.png"
                alt="Hotel Image"
                style={{
                  border: "3px solid #FDBA74",
                  borderRadius: "8px",
                  boxShadow: "0 0 10px #FDBA74",
                }}
              />
            </Col>
            <Col
              xs={20}
              md={5}
              className="text-center align-self-center mt-4 mt-md-0"
            >
              <p
                style={{
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  color: "#000000",
                  textShadow: "2px 2px 5px #FDBA74", 
                }}
              >
                EnStay prides itself on the many amenities provided with each
                room you book to your leisure. Upgrade to a higher tier room
                during the booking process!
              </p>
            </Col>
          </Row>

          {/* error if cant fetch hotels */}
          {error && <div className="error-message">{error}</div>}
        </Container>
  );
};

export default HotelSearchBar;
