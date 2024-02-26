// HotelListPage.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

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
    <div>
      <h1>Hotels</h1>
      {hotels.map((hotel) => (
        <Card key={hotel.id} style={{ width: '18rem', margin: '1rem' }}>
          <Card.Body>
            <Card.Title>{hotel.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{hotel.address}</Card.Subtitle>
            <Card.Text>(Placeholder Price)</Card.Text>
            <Button variant="primary" onClick={() => navigate(`/hotels/${hotel.id}`)}>
              View Details
            </Button>
          </Card.Body>
        </Card>
      ))}
      <Link to="/add-hotel">
        <Button variant="success">Add Hotel</Button>
      </Link>
    </div>
  );
};

export default HotelListPage;

