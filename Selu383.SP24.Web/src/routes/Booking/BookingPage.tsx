import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';

interface User {
  id: number;
  userName: string;
}

const BookingPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/authentication/me');
        if (!response.ok) {
          throw new Error(`Failed to fetch current user. Status: ${response.status}`);
        }
        const currentUserData: User = await response.json();
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <Container className="mt-4">
      <h2>This is a booking page</h2>
      {currentUser && (
        <p>Welcome, {currentUser.userName}!</p>
      )}
    </Container>
  );
};

export default BookingPage;
