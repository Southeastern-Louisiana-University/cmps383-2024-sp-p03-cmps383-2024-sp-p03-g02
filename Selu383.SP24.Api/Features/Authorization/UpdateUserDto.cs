namespace Selu383.SP24.Api.Features.Authorization
{
    public class UpdateUserDto
    {
        public string UserName { get; set; }
        public ICollection<string> Roles { get; set; }
    }
}
