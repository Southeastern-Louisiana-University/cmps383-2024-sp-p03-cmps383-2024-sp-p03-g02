using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Extensions;
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
    private readonly UserManager<User> userManager;
    public RoomsController(DataContext dataContext, UserManager<User> userManager)
    {
        _dataContext = dataContext;
        rooms = dataContext.Set<Room>();
        hotels = dataContext.Set<Hotel>();
        reservations = dataContext.Set<Reservation>();
        types = dataContext.Set<RType>();
        this.userManager = userManager;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var allRooms = rooms.
            Select(x => new RoomDto
            {
                Id = x.Id,
                HotelId = x.HotelId,
                RoomNumber = x.RoomNumber,
                Image = x.Image,
                RTypeId = x.RTypeId,
                RoomType = new RTypeDto
                {
                    Id = x.RTypeId,
                    Name = x.RoomType.Name,
                    Description = x.RoomType.Description,
                    Capacity = x.RoomType.Capacity,
                    CommonItems = x.RoomType.CommonItems,
                    Rate = x.RoomType.Rate,
                },
                Hotel = new HotelDto
                {
                    Id = x.Hotel.Id,
                    Name = x.Hotel.Name,
                    Address = x.Hotel.Address,
                    ContactNumber = x.Hotel.ContactNumber,
                    Email = x.Hotel.Email,
                    Image = x.Hotel.Image,
                }
            })
            .ToList();

        return Ok(allRooms);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetbyId(int id)
    {
        var targetRoom = rooms.Include(r => r.RoomType)
                              .FirstOrDefault(x => x.Id == id);

        if (targetRoom == null)
        {
            return NotFound();
        }

        var roomToReturn = new RoomDto
        {
            Id = id,
            HotelId = targetRoom.HotelId,
            RoomNumber = targetRoom.RoomNumber,
            Image = targetRoom.Image,
            RTypeId = targetRoom.RTypeId,
            RoomType = new RTypeDto
            {
                Id = targetRoom.RoomType.Id,
                Name = targetRoom.RoomType.Name,
                Description = targetRoom.RoomType.Description,
                Capacity = targetRoom.RoomType.Capacity,
                CommonItems = targetRoom.RoomType.CommonItems,
                Rate = targetRoom.RoomType.Rate,
            },
            
        };

        return Ok(roomToReturn);
    }


    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult CreateRoom(RoomCreateDto dto)
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
            RoomNumber = dto.RoomNumber,
            Image = dto.Image,
            RTypeId = dto.RTypeId,
        };

        rooms.Add(room);
        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = room.Id,
            HotelId = room.HotelId,
            Hotel = new HotelDto
            {
                Id =room.Hotel.Id,
                Name = room.Hotel.Name,
                Address = room.Hotel.Address,
                ManagerId = room.Hotel.ManagerId,
                ContactNumber = room.Hotel.ContactNumber,
                Email = room.Hotel.Email,
                Image = room.Hotel.Image,
            },
            RoomNumber = room.RoomNumber,
            Image = room.Image,
            RTypeId = room.RTypeId,
            RoomType = new RTypeDto
            {
                Id = room.RTypeId,
                Name = room.RoomType.Name,
                Description = room.RoomType.Description,
                Capacity = room.RoomType.Capacity,
                CommonItems = room.RoomType.CommonItems,
                Rate = room.RoomType.Rate,
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
        targetRoom.RoomNumber = dto.RoomNumber;
        targetRoom.Image = dto.Image;
        targetRoom.RTypeId = dto.RTypeId;
        targetRoom.RoomType = roomType;

        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = targetRoom.Id,
            HotelId = targetRoom.HotelId,
            RoomNumber = targetRoom.RoomNumber,
            Image = targetRoom.Image,
            RTypeId = targetRoom.RTypeId,
            RoomType = new RTypeDto
            {
                Id = targetRoom.RTypeId,
                Name = targetRoom.RoomType.Name,
                Description = targetRoom.RoomType.Description,
                Capacity = targetRoom.RoomType.Capacity,
                CommonItems = targetRoom.RoomType.CommonItems,
                Rate = targetRoom.RoomType.Rate,
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
            RoomNumber = roomToDelete.RoomNumber,
            Image = roomToDelete.Image,
            RTypeId = roomToDelete.RTypeId,
            RoomType = new RTypeDto
            {
                Id = roomToDelete.RTypeId,
                Name = roomToDelete.RoomType.Name,
                Description = roomToDelete.RoomType.Description,
                Capacity = roomToDelete.RoomType.Capacity,
                Rate = roomToDelete.RoomType.Rate,
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
                RoomNumber = room.RoomNumber,
                Image = room.Image,
                RTypeId = room.RTypeId,
                RoomType = new RTypeDto
                {
                    Id = room.RoomType.Id,
                    Name = room.RoomType.Name,
                    Description = room.RoomType.Description,
                    Capacity = room.RoomType.Capacity,
                    Rate = room.RoomType.Rate,
                },
                Hotel = new HotelDto
                {
                    Id = room.Hotel.Id,
                    Name = room.Hotel.Name,
                    Address = room.Hotel.Address,
                    ManagerId = room.Hotel.ManagerId,
                    ContactNumber = room.Hotel.ContactNumber,
                    Email = room.Hotel.Email,
                    Image = room.Hotel.Image,
                },
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
    [Authorize]
    public async Task<IActionResult> ReserveRoomAsync(ReservationDto reservationDto)
    {
        var user = await userManager.FindByNameAsync(User.Identity?.Name);


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
            CheckOutDate = reservationDto.CheckOutDate,
            UserId = user.Id,
            User = user
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

    [HttpDelete("cancelReservation/{id:int}")]
    [Authorize]
    public async Task<IActionResult> CancelReservationAsync(int id)
    {
        var user = await userManager.FindByNameAsync(User.Identity?.Name);

        var reservation = reservations.FirstOrDefault(r => r.Id == id && r.UserId == user.Id);
        if (reservation == null)
        {
            return NotFound("Reservation not found.");
        }

        reservations.Remove(reservation);
        _dataContext.SaveChanges();

        return Ok("Reservation cancelled successfully.");
    }

    [HttpGet("rtype/{id}")]
    public async Task<ActionResult<IEnumerable<RTypeDto>>> GetRTypesByHotel(int id)
    {

        var roomTypes = await rooms.Where(room => room.HotelId == id)
            .Select(room => room.RoomType)
            .Distinct()
            .Select(roomType => new RTypeDto
            {
                Id = roomType.Id,
                Name = roomType.Name,
                Description = roomType.Description,
                Capacity = roomType.Capacity,
                CommonItems = roomType.CommonItems,
                Rate = roomType.Rate,
            }).ToListAsync();

        if (roomTypes == null)
        {
            return NotFound();
        }

        return Ok(roomTypes);
    }

}