using Selu383.SP24.Api.Features.Cities;

namespace Selu383.SP24.Api.Features.Hotels;

public class HotelDto
{
    public int Id { get; set; }

    public string Name { get; set; }

    public string Address { get; set; }

    public int? ManagerId { get; set; }
    public int? LocationId { get; set; }
    public CityDto Location { get; set; }
    public string Email { get; set; }
    public string ContactNumber { get; set; }
    public string Image { get; set; }
}
