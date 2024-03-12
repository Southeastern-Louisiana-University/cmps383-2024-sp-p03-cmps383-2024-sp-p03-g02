namespace Selu383.SP24.Api.Features.Cities
{
    public class City
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CityDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class CityUpdateDto
    {
        public string Name { get; set; }
    }
}
