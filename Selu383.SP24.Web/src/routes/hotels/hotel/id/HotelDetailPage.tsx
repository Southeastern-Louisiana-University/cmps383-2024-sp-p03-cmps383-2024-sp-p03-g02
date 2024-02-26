import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
  managerId?: number;
}

interface HotelDetailsPageProps {
  onDelete: () => void;
}

const HotelDetailsPage: React.FC<HotelDetailsPageProps> = ({ onDelete }) => {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<HotelDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const response = await fetch(`api/hotels/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch hotel details. Status: ${response.status}`);
        }

        const data = await response.json();
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to fetch hotel details. Please try again.');
      }
    };

    fetchHotelDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await fetch(`api/hotels/${id}`, { method: 'DELETE' });
      onDelete();
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {hotel && (
        <Card style={{ width: '18rem', margin: '1rem' }}>
          <Card.Body>
            <Card.Title>{hotel.name}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">{hotel.address}</Card.Subtitle>
            <Card.Text>(Placeholder Price)</Card.Text>
            <Button variant="danger" onClick={handleDelete}>
              Delete Hotel
            </Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default HotelDetailsPage;
