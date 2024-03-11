import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
}

const HotelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch hotel details. Status: ${response.status}`
          );
        }

        const data: HotelDto = await response.json();
        setHotel(data);
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError("Failed to fetch hotel details. Please try again.");
      }
    };

    fetchHotelDetails();
  }, [id]);

  return (
    <Container className="mt-4">
      {hotel && (
        <div>
          {/* Hotel name at the top */}
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

          {/* Container with centered image on the left */}
          <Row className="justify-content-center">
            <Col xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card style={{ width: "100%", textAlign: "center" }}>
                {/* Placeholder image */}
                <Card.Img
                  variant="top"
                  src="https://imgur.com/f6DUjOS.png"
                  alt="Hotel Placeholder"
                  style={{ width: "100%" }}
                />
              </Card>
            </Col>
          </Row>

          {/* Right side with address, description, and return button */}
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
              <Link to="/hotels" className="btn btn-warning">
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
