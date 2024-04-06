using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.Rooms;
using Selu383.SP24.Api.Features.RTypes;

namespace Selu383.SP24.Api.Controllers
{
    [Route("api/reservations")]
    [ApiController]
    public class ReservationsController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly DbSet<Room> rooms;
        private readonly DbSet<Hotel> hotels;
        private readonly DbSet<Reservation> reservations;
        private readonly DbSet<RType> types;
        private readonly UserManager<User> userManager;
        
        public ReservationsController(DataContext dataContext, UserManager<User> userManager)
        {
            _dataContext = dataContext;
            rooms = dataContext.Set<Room>();
            hotels = dataContext.Set<Hotel>();
            reservations = dataContext.Set<Reservation>();
            types = dataContext.Set<RType>();
            this.userManager = userManager;
        }

        [HttpGet("myBookings")]
        [Authorize]
        public async Task<IActionResult> myBookings()
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            if(user == null)
            {
                return BadRequest();
            }

            var bookings = reservations.Where(x => x.UserId == user.Id)
                .Select(x => new ReservationDto
                {
                    Id = x.Id,
                    RoomId = x.RoomId,
                    HotelId = x.Room.HotelId,
                    Room = new RoomDto
                    {
                        Id = x.RoomId,
                        RoomNumber = x.Room.RoomNumber,
                        Image = x.Room.Image,
                        HotelId = x.Room.HotelId,
                        Hotel = new HotelDto
                        {
                            Id= x.Room.Hotel.Id,
                            Name = x.Room.Hotel.Name,
                            ContactNumber = x.Room.Hotel.ContactNumber,
                            Email = x.Room.Hotel.Email, 
                            Address = x.Room.Hotel.Address,
                            Image = x.Room.Hotel.Image,
                            ManagerId = x.Room.Hotel.ManagerId
                        },
                        RTypeId = x.Room.RTypeId,
                        RoomType = new RTypeDto
                        {
                            Id = x.Room.RoomType.Id,
                            Name = x.Room.RoomType.Name,
                            CommonItems = x.Room.RoomType.CommonItems,
                            Capacity = x.Room.RoomType.Capacity,
                            Description = x.Room.RoomType.Description,
                            Rate = x.Room.RoomType.Rate,
                        },  
                    },
                    CheckInDate = x.CheckInDate,
                    CheckOutDate = x.CheckOutDate,
                    UserId = x.UserId,
                    User = new UserDto
                    {
                       Id = x.User.Id,
                       UserName = x.User.UserName,
                    }
                }).ToList();

            return Ok(bookings);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await userManager.FindByNameAsync(User.Identity?.Name);
            
            if (user == null)
            {
                return BadRequest();
            }

            var targetReservation = reservations.Include(r => r.Room).ThenInclude(room => room.Hotel)
                .Include(r => r.Room).ThenInclude(room => room.RoomType)
                .FirstOrDefault(r => r.Id == id);

            if (targetReservation == null)
            {
                return NotFound();
            }

            if (targetReservation.UserId != user.Id)
            {
                return BadRequest();
            }

            var reservationToReturn = new ReservationDto
            {
                Id = targetReservation.Id,
                RoomId = targetReservation.RoomId,
                HotelId = targetReservation.Room.HotelId,
                Room = new RoomDto
                {
                    Id = targetReservation.RoomId,
                    RoomNumber = targetReservation.Room.RoomNumber,
                    Image = targetReservation.Room.Image,
                    HotelId = targetReservation.Room.HotelId,
                    Hotel = new HotelDto
                    {
                        Id = targetReservation.Room.Hotel.Id,
                        Name = targetReservation.Room.Hotel.Name,
                        ContactNumber = targetReservation.Room.Hotel.ContactNumber,
                        Email = targetReservation.Room.Hotel.Email,
                        Address = targetReservation.Room.Hotel.Address,
                        Image = targetReservation.Room.Hotel.Image,
                        ManagerId = targetReservation.Room.Hotel.ManagerId
                    },
                    RTypeId = targetReservation.Room.RTypeId,
                    RoomType = new RTypeDto
                    {
                        Id = targetReservation.Room.RoomType.Id,
                        Name = targetReservation.Room.RoomType.Name,
                        CommonItems = targetReservation.Room.RoomType.CommonItems,
                        Capacity = targetReservation.Room.RoomType.Capacity,
                        Description = targetReservation.Room.RoomType.Description,
                        Rate = targetReservation.Room.RoomType.Rate,
                    },
                },
                CheckInDate = targetReservation.CheckInDate,
                CheckOutDate = targetReservation.CheckOutDate,
                UserId = targetReservation.UserId,
                User = new UserDto
                {
                    Id = targetReservation.User.Id,
                    UserName = targetReservation.User.UserName,
                }
            };

            return Ok(reservationToReturn);

        }

        [HttpPost("hotel/{hotelId}/rtype/{typeId}")]
        public async Task<IActionResult> ReserveRoomByHotelAndType(int hotelId, int typeId, CreateReservationDto reservationDto)
        {

            var user = await userManager.FindByNameAsync(User.Identity?.Name);

            if(user == null)
            {
                BadRequest();
            }
            var availableRooms = rooms.Where(x => x.HotelId == hotelId && x.RTypeId == typeId).ToList();
            var room = availableRooms.FirstOrDefault(x => IsRoomAvailable(x.Id, reservationDto.CheckInDate, reservationDto.CheckOutDate));

            if (room == null)
            {
                return NotFound("No room of that type is available in specified hotel.");
            }

            if(reservationDto.CheckInDate == reservationDto.CheckOutDate)
            {
                return BadRequest();
            }
            
            var reservation = new Reservation
            {
                RoomId = room.Id,
                Room = room,
                CheckInDate = reservationDto.CheckInDate,
                CheckOutDate = reservationDto.CheckOutDate,
                UserId = user.Id,
                User = user
            };
            reservations.Add(reservation);
            _dataContext.SaveChanges();

            return Ok("Room reserved successfully.");
        }

        [HttpGet]
        [Authorize(Roles = RoleNames.Admin)]
        public IActionResult GetAll()
        {
            var allBookings = reservations
                .Select(x => new ReservationDto 
                { 
                    Id = x.Id,
                    HotelId = x.Room.HotelId,
                    RoomId = x.RoomId,
                    CheckInDate = x.CheckInDate,
                    CheckOutDate = x.CheckOutDate,
                    UserId = x.UserId,
                    User = new UserDto
                    {
                        Id = x.User.Id,
                        UserName = x.User.UserName
                    },
                    Room = new RoomDto
                    {
                        Id = x.RoomId,
                        RoomNumber = x.Room.RoomNumber,
                        Image = x.Room.Image,
                        HotelId = x.Room.HotelId,
                        Hotel = new HotelDto
                        {
                            Id = x.Room.Hotel.Id,
                            Name = x.Room.Hotel.Name,
                            ContactNumber = x.Room.Hotel.ContactNumber,
                            Email = x.Room.Hotel.Email,
                            Address = x.Room.Hotel.Address,
                            Image = x.Room.Hotel.Image,
                            ManagerId = x.Room.Hotel.ManagerId
                        },
                        RTypeId = x.Room.RTypeId,
                        RoomType = new RTypeDto
                        {
                            Id = x.Room.RoomType.Id,
                            Name = x.Room.RoomType.Name,
                            CommonItems = x.Room.RoomType.CommonItems,
                            Capacity = x.Room.RoomType.Capacity,
                            Description = x.Room.RoomType.Description,
                            Rate = x.Room.RoomType.Rate,
                        },
                    },
                })
                .ToList();

            return Ok(allBookings);
        }
       
        private bool IsRoomAvailable(int roomId, DateTime checkInDate, DateTime checkOutDate)
        {
            return !reservations.Any(r =>
                r.RoomId == roomId &&
                (checkInDate < r.CheckOutDate && checkOutDate > r.CheckInDate));
        }
    }
}
