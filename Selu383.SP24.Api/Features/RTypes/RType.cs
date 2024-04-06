namespace Selu383.SP24.Api.Features.RTypes
{
    public class RType
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string CommonItems { get; set; }
        public int Rate { get; set; }
    }

    public class RTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string CommonItems { get; set; }
        public int Rate { get; set; }
    }

    public class RTypeUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Capacity { get; set; }
        public string CommonItems { get; set; }
        public int Rate { get; set; }
    }
}