using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.Rooms;
using Selu383.SP24.Api.Features.RTypes;

[Route("api/rooms")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly DbSet<Room> rooms;
    private readonly DbSet<Hotel> hotels;
    private readonly DbSet<Reservation> reservations;
    private readonly DbSet<RType> types;
    public RoomsController(DataContext dataContext)
    {
        _dataContext = dataContext;
        rooms = dataContext.Set<Room>();
        hotels = dataContext.Set<Hotel>();
        reservations = dataContext.Set<Reservation>();
        types = dataContext.Set<RType>();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var allRooms = rooms.
            Select(x => new RoomDto
            {
                Id = x.Id,
                HotelId = x.HotelId,
                Rate = x.Rate,
                RoomNumber = x.RoomNumber,
                Image = x.Image,
                RTypeId = x.RTypeId,
                RoomType = new RTypeDto
                {
                    Id = x.RTypeId,
                    Name = x.RoomType.Name,
                    Description = x.RoomType.Description,
                    Capacity = x.RoomType.Capacity
                }
            })
            .ToList();

        return Ok(allRooms);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetbyId(int id)
    {
        var targetRoom = rooms.FirstOrDefault(x => x.Id == id);
        var roomType = types.FirstOrDefault(x => x.Id == targetRoom.RTypeId);

        if (targetRoom == null)
        {
            return NotFound();
        }

        var roomToReturn = new RoomDto
        {
            Id = id,
            HotelId = targetRoom.HotelId,
            Rate = targetRoom.Rate,
            RoomNumber = targetRoom.RoomNumber,
            Image = targetRoom.Image,
            RTypeId = targetRoom.RTypeId,
            RoomType = new RTypeDto
            {
                Id = targetRoom.RTypeId,
                Name = targetRoom.RoomType.Name,
                Description = targetRoom.RoomType.Description,
                Capacity = targetRoom.RoomType.Capacity
            }
        };
        return Ok(roomToReturn);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult CreateRoom(RoomDto dto)
    {

        var hotel = hotels.FirstOrDefault(x => x.Id == dto.HotelId);
        var roomType = types.FirstOrDefault(x => x.Id == dto.RTypeId);
        if (hotel == null)
        {
            return BadRequest();
        }

        if (roomType == null)
        {
            return BadRequest();
        }
        var room = new Room
        {
            HotelId = dto.HotelId,
            Rate = dto.Rate,
            RoomNumber = dto.RoomNumber,
            Image = dto.Image,
            RTypeId = dto.RTypeId,
            RoomType = roomType
        };

        rooms.Add(room);
        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = room.Id,
            HotelId = room.HotelId,
            Rate = room.Rate,
            RoomNumber = room.RoomNumber,
            Image = room.Image,
            RTypeId = room.RTypeId,
            RoomType = new RTypeDto
            {
                Id = room.RTypeId,
                Name = room.RoomType.Name,
                Description = room.RoomType.Description,
                Capacity = room.RoomType.Capacity
            }
        };

        return CreatedAtAction(nameof(GetbyId), new { id = roomToReturn.Id }, roomToReturn);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult PutRoom([FromBody] RoomUpdateDto dto, [FromRoute] int id)
    {
        var hotel = hotels.FirstOrDefault(x => x.Id == dto.HotelId);
        var roomType = types.FirstOrDefault(x => x.Id == dto.RTypeId);
        if (roomType == null)
        {
            return BadRequest();
        }
        if (hotel == null)
        {
            return BadRequest();
        }
        var targetRoom = rooms
            .FirstOrDefault(x => x.Id == id);

        if (targetRoom == null)
        {
            return NotFound();
        }

        targetRoom.HotelId = dto.HotelId;
        targetRoom.Rate = dto.Rate;
        targetRoom.RoomNumber = dto.RoomNumber;
        targetRoom.Image = dto.Image;
        targetRoom.RTypeId = dto.RTypeId;
        targetRoom.RoomType = roomType;

        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = targetRoom.Id,
            HotelId = targetRoom.HotelId,
            Rate = targetRoom.Rate,
            RoomNumber = targetRoom.Rate,
            Image = targetRoom.Image,
            RTypeId = targetRoom.RTypeId,
            RoomType = new RTypeDto
            {
                Id = targetRoom.RTypeId,
                Name = targetRoom.RoomType.Name,
                Description = targetRoom.RoomType.Description,
                Capacity = targetRoom.RoomType.Capacity
            }
        };
        return Ok(roomToReturn);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult DeleteRoom([FromRoute] int id)
    {
        var roomToDelete = rooms.
            FirstOrDefault(x => x.Id == id);

        if (roomToDelete == null)
        {
            return NotFound();
        }
        rooms.Remove(roomToDelete);
        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = roomToDelete.Id,
            HotelId = roomToDelete.HotelId,
            Rate = roomToDelete.Rate,
            RoomNumber = roomToDelete.Rate,
            Image = roomToDelete.Image,
            RTypeId = roomToDelete.RTypeId,
            RoomType = new RTypeDto
            {
                Id = roomToDelete.RTypeId,
                Name = roomToDelete.RoomType.Name,
                Description = roomToDelete.RoomType.Description,
                Capacity = roomToDelete.RoomType.Capacity
            }
        };

        return Ok(roomToReturn);
    }

    [HttpGet("available")]
    public IActionResult GetAvailableRooms(DateTime selectedDate, int numGuests)
    {
        var availableRooms = rooms
            .Where(room => !room.Reservations.Any(reservation =>
                selectedDate < reservation.CheckOutDate &&
                selectedDate >= reservation.CheckInDate))
            .Where(room => room.RoomType.Capacity >= numGuests)
            .Select(room => new RoomDto
            {
                Id = room.Id,
                HotelId = room.HotelId,
                Rate = room.Rate,
                RoomNumber = room.RoomNumber,
                Image = room.Image,
                RTypeId = room.RTypeId,
                RoomType = new RTypeDto
                {
                    Id = room.RoomType.Id,
                    Name = room.RoomType.Name,
                    Description = room.RoomType.Description,
                    Capacity = room.RoomType.Capacity
                },
                Hotel = new HotelDto
                {
                    Id = room.Hotel.Id,
                    Name = room.Hotel.Name,
                    Address = room.Hotel.Address,
                    LocationId = room.Hotel.LocationId
                }
            })
            .ToList();

        return Ok(availableRooms);
    }

    private bool IsRoomAvailable(int roomId, DateTime checkInDate, DateTime checkOutDate)
    {
        return !reservations.Any(r =>
            r.RoomId == roomId &&
            (checkInDate < r.CheckOutDate && checkOutDate > r.CheckInDate));
    }

    [HttpPost("reserve")]
    public IActionResult ReserveRoom(ReservationDto reservationDto)
    {
        var room = rooms.FirstOrDefault(r => r.Id == reservationDto.RoomId && r.HotelId == reservationDto.HotelId);
        if (room == null)
        {
            return NotFound("Room not found in the specified hotel.");
        }

        var isAvailable = IsRoomAvailable(room.Id, reservationDto.CheckInDate, reservationDto.CheckOutDate);
        if (!isAvailable)
        {
            return BadRequest("The room is not available for the selected dates.");
        }

        // Create the reservation
        var reservation = new Reservation
        {
            RoomId = room.Id,
            CheckInDate = reservationDto.CheckInDate,
            CheckOutDate = reservationDto.CheckOutDate
        };

        reservations.Add(reservation);
        _dataContext.SaveChanges();

        return Ok("Room reserved successfully.");
    }

    [HttpDelete("DeleteReservation")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult DeleteAllReservations()
    {
        try
        {
            reservations.RemoveRange(reservations); // Delete all reservations
            _dataContext.SaveChanges();
            return Ok("All reservations deleted successfully.");
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"An error occurred while deleting reservations: {ex.Message}");
        }
    }

}