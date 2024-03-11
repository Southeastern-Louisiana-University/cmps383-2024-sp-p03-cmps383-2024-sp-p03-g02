import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
  managerId?: number;
}

const HotelListPage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch('api/hotels');
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Hotels</h1>
      <Row className="justify-content-center">
        {hotels.map((hotel) => (
          <Col key={hotel.id} md={3} className="mb-3">
            <Link to={`/hotels/${hotel.id}`} style={{ textDecoration: 'none' }}>
              <Card
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s',
                }}
                className="shadow"
              >
                {/* Placeholder image */}
                <Card.Img
                  variant="top"
                  src="https://imgur.com/f6DUjOS.png"
                  alt="Hotel Placeholder"
                />

                <Card.Body>
                  <Card.Title style={{ color: '#FDBA74' }}>{hotel.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hotel.address}</Card.Subtitle>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HotelListPage;
