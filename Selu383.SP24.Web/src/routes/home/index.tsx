import { useState, useEffect, useRef } from "react";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { DateRange } from "react-date-range";
import format from "date-fns/format";
import { addDays } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface RoomDto {
  id: number;
  hotelId: number;
  rate: number;
  roomNumber: number;
  image: string;
  rTypeId: number;
  roomType: RTypeDto;
}

interface RTypeDto {
  id: number;
  name: string;
  description: string;
}

interface HotelDto {
  id: number;
  name?: string;
  address: string;
  locationId: number;
}

const HotelSearchBar = () => {
  const [selectedCheckInDate, setSelectedCheckInDate] = useState<Date | null>(
    null
  );
  const [selectedCheckOutDate, setSelectedCheckOutDate] = useState<Date | null>(
    null
  );
  const [numGuests, setNumGuests] = useState(1);
  const [numRooms, setNumRooms] = useState(1);
  const [searchResults, setSearchResults] = useState<Array<RoomDto>>([]);
  const [hotels, setHotels] = useState<HotelDto[]>([]);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const refOne = useRef(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels");
        const data: HotelDto[] = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, []);

  const handleReservation = async (
    room: RoomDto,
    checkInDate: Date | null,
    checkOutDate: Date | null
  ) => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const reservationData = {
      roomId: room.id,
      hotelId: room.hotelId,
      checkInDate: format(checkInDate, "yyyy-MM-dd"),
      checkOutDate: format(checkOutDate, "yyyy-MM-dd"),
    };
    try {
      const response = await fetch("/api/rooms/reserve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (response.ok) {
        alert("Room reserved successfully!");
      } else {
        const responseData = await response.json();
        alert(
          `Failed to reserve room: ${response.status} - ${response.statusText}. ${responseData.message}`
        );
      }
    } catch (error) {
      alert("Failed to reserve room. Please try again later.");
      console.error("Reservation error:", error);
    }
  };

  const handleSearch = async () => {
    const url = `/api/rooms/available?selectedDate=${format(
      range[0].startDate,
      "yyyy-MM-dd"
    )}&numGuests=${numGuests}`;
    console.log(url);
    const response = await fetch(url);
    if (response.ok) {
      const availableRooms: Array<RoomDto> = await response.json();
      setSearchResults(availableRooms);
      setSelectedCheckInDate(range[0].startDate); // Update selected check-in date
      setSelectedCheckOutDate(range[0].endDate); // Update selected check-out date
    } else {
      console.error("Failed to fetch available rooms");
    }
  };

  return (
    <>
      <div className="wrapper">
        <center>
          <h1>Welcome to EnStay!</h1>
        </center>
      </div>

      <div className="wrapper">
        <center>
          <Container fluid className="mt-4">
            <Row className="justify-content-center">
              <Col xs={12} md={8}>
                <Form>
                  <Row className="align-items-center no-gutters">
                    <Col xs={12} md={3} className="pr-md-2">
                      <Form.Group className="mb-0">
                        <Form.Label>Check-in / Check-out</Form.Label>
                        <Form.Control
                          type="text"
                          value={`${format(
                            range[0].startDate,
                            "MM/dd/yyyy"
                          )} to ${format(range[0].endDate, "MM/dd/yyyy")}`}
                          readOnly
                          onClick={() => setOpen((open) => !open)}
                        />
                      </Form.Group>
                      {open && (
                        <DateRange
                          onChange={(ranges) => {
                            const startDate =
                              ranges.selection?.startDate ?? new Date();
                            const endDate =
                              ranges.selection?.endDate ??
                              addDays(new Date(), 7);
                            setRange([
                              { startDate, endDate, key: "selection" },
                            ]);
                          }}
                          editableDateInputs={true}
                          moveRangeOnFirstSelection={false}
                          ranges={range}
                          months={1}
                          direction="horizontal"
                          minDate={new Date()}
                          className="position-absolute"
                        />
                      )}
                    </Col>
                    <Col xs={12} md={2} className="pr-md-2">
                      <Form.Group className="mb-0">
                        <Form.Label>Guests</Form.Label>
                        <Form.Control
                          as="select"
                          value={numGuests}
                          onChange={(e) =>
                            setNumGuests(parseInt(e.target.value))
                          }
                        >
                          {[...Array(10).keys()].map((num) => (
                            <option key={num} value={num + 2}>
                              {num + 2} Guests
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={2} className="pr-md-2">
                      <Form.Group className="mb-0">
                        <Form.Label>Rooms</Form.Label>
                        <Form.Control
                          as="select"
                          value={numRooms}
                          onChange={(e) =>
                            setNumRooms(parseInt(e.target.value))
                          }
                        >
                          {[...Array(5).keys()].map((num) => (
                            <option key={num} value={num + 1}>
                              {num + 1} Room(s)
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={2}>
                      <Button variant="primary" onClick={handleSearch}>
                        Search
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </Container>
        </center>
      </div>

      <div className="wrapper">
        <Container fluid>
          <Row>
            {searchResults.map((room) => (
              <Col key={room.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
                <Card
                  style={{
                    width: "100%",
                    height: "100%", // Ensure all cards have the same height
                    cursor: "pointer",
                    transition: "box-shadow 0.3s",
                  }}
                  className="shadow"
                >
                  <Card.Img variant="top" src={room.image} alt="Room Image" />
                  <Card.Body>
                    <Card.Title
                      style={{
                        color: "#000000",
                        fontWeight: "bold",
                        textShadow: "2px 2px 5px #FDBA74",
                      }}
                    >
                      Hotel Name:{" "}
                      {hotels.find((hotel) => hotel.id === room.hotelId)
                        ?.name ?? "Unknown"}
                    </Card.Title>
                    <Card.Text>Room Number: {room.roomNumber}</Card.Text>
                    <Card.Text>Rate: ${room.rate}</Card.Text>
                    <Card.Text>
                      Description: {room.roomType.description}
                    </Card.Text>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                      }}
                    >
                      <Button
                        onClick={() => {
                          handleReservation(
                            room,
                            selectedCheckInDate,
                            selectedCheckOutDate
                          );
                          window.location.reload();
                        }}
                      >
                        Reserve
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </>
  );
};

export default HotelSearchBar;
