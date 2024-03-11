import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

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
        const response = await fetch(`/api/hotels/${id}`); // Corrected URL construction

        if (!response.ok) {
          throw new Error(`Failed to fetch hotel details. Status: ${response.status}`);
        }

        const data: HotelDto = await response.json();
        setHotel(data);
      } catch (error) {
        console.error('Error fetching hotel details:', error);
        setError('Failed to fetch hotel details. Please try again.');
      }
    };

    fetchHotelDetails();
  }, [id]);

  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      {hotel && (
        <div>
          <h2>The details for {hotel.name}</h2>
          <p>Address: {hotel.address}</p>
          <Link to="/">Go Back Home</Link>
        </div>
      )}
    </div>
  );
};

export default HotelDetailsPage;
