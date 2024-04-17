using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.RTypes;

namespace Selu383.SP24.Api.Features.Rooms
{
    public class Room
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public Hotel Hotel { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
        public int RTypeId { get; set; }
        public RType RoomType { get; set; }
        public ICollection<Reservation> Reservations { get; set; }
    }

    public class RoomDto
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public HotelDto Hotel { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
        public int RTypeId { get; set; }
        public RTypeDto RoomType { get; set; }
    }

    public class RoomUpdateDto
    {
        public int HotelId { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
        public int RTypeId { get; set; }
    }

    public class RoomCreateDto
    {
        public int HotelId { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
        public int RTypeId { get; set; }
    }
}