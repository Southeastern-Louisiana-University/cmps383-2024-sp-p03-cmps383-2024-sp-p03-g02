import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

interface HotelDto {
    id?: number;
    name?: string;
    address?: string;
    email?: string;
    locationId: number;
    location?:{
        id: number;
        name: string;
    }
  }

export default function SearchHotels() {
  const [params] = useSearchParams();
  const searchTerm = params.get("searchTerm");

  const [hotels, setHotels] = useState<HotelDto[]>([]);

  useEffect(() => {
    fetch("/api/hotels/find", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
      }),
    })
      .then<HotelDto[]>((r) => r.json())
      .then((j) => {
        setHotels(j);
      });
  }, [searchTerm]);
  console.log(searchTerm);

  return (
    <Container fluid className="mt-4">
      <h1 className="text-center mb-4" style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 5px #FDBA74' }}>Hotels</h1>
      <Row className="justify-content-center">
        {hotels.map((hotel,) => (
          <Col key={hotel.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
            <Link to={`/hotels/${hotel.id}`} style={{ textDecoration: 'none' }}>
              <Card
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s',
                }}
                className="shadow"
              >
                {/* Placeholder image below!!!! */}
                <Card.Img
                  variant="top"
                  src="https://imgur.com/MLARzB8.png"
                  alt="Hotel Placeholder"
                />

                <Card.Body>
                  <Card.Title style={{ color: '#000000', fontWeight: 'bold', textShadow: '2px 2px 5px #FDBA74' }}>{hotel.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{hotel.address}, {hotel.location?.name}</Card.Subtitle>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
}