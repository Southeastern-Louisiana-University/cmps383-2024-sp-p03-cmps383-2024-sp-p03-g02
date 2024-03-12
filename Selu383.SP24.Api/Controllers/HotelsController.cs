using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Extensions;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Cities;
using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.Rooms;
using Selu383.SP24.Api.Features.RTypes;

namespace Selu383.SP24.Api.Controllers;

[Route("api/hotels")]
[ApiController]
public class HotelsController : ControllerBase
{
    private readonly DbSet<Hotel> hotels;
    private readonly DbSet<City> cities;
    private readonly DbSet<Room> rooms;
    private readonly DataContext dataContext;

    public HotelsController(DataContext dataContext)
    {
        this.dataContext = dataContext;
        hotels = dataContext.Set<Hotel>();
        cities = dataContext.Set<City>();
        rooms = dataContext.Set<Room>();
    }

    [HttpGet]
    public IQueryable<HotelDto> GetAllHotels()
    {
        return GetHotelDtos(hotels);
    }
    [HttpGet]
    [Route("{id}/rooms")]
    public IActionResult GetRoomsByHotelId(int id)
    {
        var allRooms = rooms.Where(x => x.HotelId == id)
            .Select(x => new RoomDto
            {
                Id = x.Id,
                HotelId = x.HotelId,
                Rate = x.Rate,
                RoomNumber = x.RoomNumber,
                RTypeId = x.RTypeId,
                Image = x.Image,
                RoomType = new RTypeDto
                {
                    Id = x.RTypeId,
                    Name = x.RoomType.Name,
                    Description = x.RoomType.Description,
                }
            })
            .ToList();

        return Ok(allRooms);
    }

    [HttpGet]
    [Route("{id}")]
    public ActionResult<HotelDto> GetHotelById(int id)
    {
        var result = GetHotelDtos(hotels.Where(x => x.Id == id)).FirstOrDefault();
        if (result == null)
        {
            return NotFound();
        }

        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public ActionResult<HotelDto> CreateHotel(HotelDto dto)
    {

        var city = cities.FirstOrDefault(x => x.Id == dto.LocationId);
        if (city == null)
        {
            return BadRequest();
        }

        if (IsInvalid(dto))
        {
            return BadRequest();
        }
        var hotel = new Hotel
        {
            Name = dto.Name,
            Address = dto.Address,
            ManagerId = dto.ManagerId,
            LocationId = dto.LocationId,
            ContactNumber = dto.ContactNumber,
            Email = dto.Email,
            Image = dto.Image,
            Location = city
        };
        hotels.Add(hotel);

        dataContext.SaveChanges();

        dto.Id = hotel.Id;

        return CreatedAtAction(nameof(GetHotelById), new { id = dto.Id }, dto);
    }

    [HttpPut]
    [Route("{id}")]
    [Authorize]
    public ActionResult<HotelDto> UpdateHotel(int id, HotelDto dto)
    {
        if (IsInvalid(dto))
        {
            return BadRequest();
        }

        var city = cities.FirstOrDefault(x => x.Id == dto.LocationId);
        if (city == null)
        {
            return BadRequest();
        }

        var hotel = hotels.FirstOrDefault(x => x.Id == id);
        if (hotel == null)
        {
            return NotFound();
        }

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != hotel.ManagerId)
        {
            return Forbid();
        }

        hotel.Name = dto.Name;
        hotel.Address = dto.Address;
        hotel.LocationId = dto.LocationId;
        hotel.ContactNumber = dto.ContactNumber;
        hotel.Email = dto.Email;
        hotel.Image = dto.Image;
        hotel.Location = city;
        if (User.IsInRole(RoleNames.Admin))
        {
            hotel.ManagerId = dto.ManagerId;
        }

        dataContext.SaveChanges();

        dto.Id = hotel.Id;

        return Ok(dto);
    }

    [HttpDelete]
    [Route("{id}")]
    [Authorize]
    public ActionResult DeleteHotel(int id)
    {
        var hotel = hotels.FirstOrDefault(x => x.Id == id);
        if (hotel == null)
        {
            return NotFound();
        }

        if (!User.IsInRole(RoleNames.Admin) && User.GetCurrentUserId() != hotel.ManagerId)
        {
            return Forbid();
        }

        hotels.Remove(hotel);

        dataContext.SaveChanges();

        return Ok();
    }

    private bool InvalidManagerId(int? managerId)
    {
        if (managerId == null)
        {
            return false;
        }

        if (!User.IsInRole(RoleNames.Admin))
        {
            // only admins can change manager ids anyway
            return false;
        }
        return !dataContext.Set<User>().Any(x => x.Id == managerId);
    }

    private bool IsInvalid(HotelDto dto)
    {
        return string.IsNullOrWhiteSpace(dto.Name) ||
               dto.Name.Length > 120 ||
               string.IsNullOrWhiteSpace(dto.Address) ||
               InvalidManagerId(dto.ManagerId) ||
               string.IsNullOrWhiteSpace(dto.ContactNumber) ||
               string.IsNullOrWhiteSpace(dto.Email);
    }

    private static IQueryable<HotelDto> GetHotelDtos(IQueryable<Hotel> hotels)
    {
        return hotels
            .Select(x => new HotelDto
            {
                Id = x.Id,
                Name = x.Name,
                Address = x.Address,
                ManagerId = x.ManagerId,
                LocationId = x.Location.Id,
                Location = new CityDto
                {
                    Id = x.Location.Id,
                    Name = x.Location.Name,
                },
                ContactNumber = x.ContactNumber,
                Email = x.Email,
                Image = x.Image,
            });
    }
}
