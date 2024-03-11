namespace Selu383.SP24.Api.Features.RTypes
{
    public class RType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class RTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class RTypeUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
    }
}