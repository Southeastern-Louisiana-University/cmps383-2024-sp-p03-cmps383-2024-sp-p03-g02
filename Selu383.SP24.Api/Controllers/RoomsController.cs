using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.Rooms;

[Route("api/rooms")]
[ApiController]
public class RoomsController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly DbSet<Room> rooms;
    private readonly DbSet<Hotel> hotels;

    public RoomsController(DataContext dataContext)
    {
        _dataContext = dataContext;
        rooms = dataContext.Set<Room>();
        hotels = dataContext.Set<Hotel>();
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
            })
            .ToList();

        return Ok(allRooms);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetbyId(int id)
    {
        var targetRoom = rooms.FirstOrDefault(x => x.Id == id);

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
        };
        return Ok(roomToReturn);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult CreateRoom(RoomDto dto)
    {

        var hotel = hotels.FirstOrDefault(x => x.Id == dto.HotelId);
        if(hotel == null)
        {
            return BadRequest();
        }
        var room = new Room
        {
            HotelId = dto.HotelId,
            Rate = dto.Rate,
            RoomNumber = dto.RoomNumber,
            Image = dto.Image,
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
        };

        return CreatedAtAction(nameof(GetbyId), new { id = roomToReturn.Id }, roomToReturn);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult PutRoom([FromBody] RoomUpdateDto dto, [FromRoute] int id)
    {
        var hotel = hotels.FirstOrDefault(x => x.Id == dto.HotelId);
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

        _dataContext.SaveChanges();

        var roomToReturn = new RoomDto
        {
            Id = targetRoom.Id,
            HotelId = targetRoom.HotelId,
            Rate = targetRoom.Rate,
            RoomNumber = targetRoom.Rate,
            Image = targetRoom.Image
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
            Image = roomToDelete.Image
        };

        return Ok(roomToReturn);
    }
}
