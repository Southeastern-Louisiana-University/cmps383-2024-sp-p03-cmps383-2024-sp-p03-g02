using Selu383.SP24.Api.Features.Hotels;

namespace Selu383.SP24.Api.Features.Rooms
{
    public class Room
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public Hotel hotel { get; set; }
        public int Rate { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
    }

    public class RoomDto
    {
        public int Id { get; set; }
        public int HotelId { get; set; }
        public int Rate { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
    }

    public class RoomUpdateDto
    {
        public int HotelId { get; set; }
        public int Rate { get; set; }
        public int RoomNumber { get; set; }
        public string Image { get; set; }
    }
}
