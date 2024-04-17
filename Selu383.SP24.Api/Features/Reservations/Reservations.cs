using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Rooms;

public class Reservation
{
    public int Id { get; set; }
    public int RoomId { get; set; }
    public Room Room { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int? UserId { get; set; }
    public virtual User? User { get; set; }
}

public class ReservationDto
{
    public int Id { get; set; }
    public int HotelId { get; set; }
    public int RoomId { get; set; }
    public RoomDto Room { get; set; }
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
    public int? UserId { get; set; }
    public virtual UserDto? User { get; set; }
}

public class CreateReservationDto
{
    public DateTime CheckInDate { get; set; }
    public DateTime CheckOutDate { get; set; }
}