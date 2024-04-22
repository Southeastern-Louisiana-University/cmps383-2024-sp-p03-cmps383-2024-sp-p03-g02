import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Button, Modal, Form } from 'react-bootstrap';

interface HotelDto {
  id?: number;
  name?: string;
  address?: string;
  managerId?: number;
}

const AdminDashboard: React.FC = () => {
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHotel, setNewHotel] = useState<HotelDto>({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedHotel, setEditedHotel] = useState<HotelDto>({});

  useEffect(() => {
    // Fetch hotels on component mount
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await fetch('api/hotels');
      const data = await response.json();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const handleAddHotel = async () => {
    try {
      const response = await fetch('api/hotels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHotel),
      });
      if (response.ok) {
        setShowAddModal(false);
        fetchHotels(); // Refresh hotels after adding
      } else {
        console.error('Failed to add hotel');
      }
    } catch (error) {
      console.error('Error adding hotel:', error);
    }
  };

  const handleEditHotel = async () => {
    try {
      const response = await fetch(`api/hotels/${editedHotel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedHotel),
      });
      if (response.ok) {
        setShowEditModal(false);
        fetchHotels(); // Refresh hotels after editing
      } else {
        console.error('Failed to edit hotel');
      }
    } catch (error) {
      console.error('Error editing hotel:', error);
    }
  };

  const handleDeleteHotel = async (id: number) => {
    try {
      const response = await fetch(`api/hotels/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchHotels(); // Refresh hotels after deletion
      } else {
        console.error('Failed to delete hotel');
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  return (
    <Container fluid className="mt-4">
      <h1 className="text-center mb-4" style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 5px #FDBA74' }}>Admin Dashboard</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Hotel</Button>

      {/* Add Hotel Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formHotelName">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control type="text" placeholder="Enter hotel name" onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formHotelAddress">
              <Form.Label>Hotel Address</Form.Label>
              <Form.Control type="text" placeholder="Enter hotel address" onChange={(e) => setNewHotel({ ...newHotel, address: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddHotel}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Hotel Cards */}
      <Row className="justify-content-center mt-4">
        {hotels.map((hotel) => (
          <Col key={hotel.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{hotel.address}</Card.Subtitle>
                <Button variant="primary" onClick={() => { setShowEditModal(true); setEditedHotel(hotel); }}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteHotel(hotel.id!)}>Delete</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Edit Hotel Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formHotelName">
              <Form.Label>Hotel Name</Form.Label>
              <Form.Control type="text" placeholder="Enter hotel name" value={editedHotel.name} onChange={(e) => setEditedHotel({ ...editedHotel, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formHotelAddress">
              <Form.Label>Hotel Address</Form.Label>
              <Form.Control type="text" placeholder="Enter hotel address" value={editedHotel.address} onChange={(e) => setEditedHotel({ ...editedHotel, address: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditHotel}>Save</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
