namespace Selu383.SP24.Api.Features.Authorization;

public class UserDto
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public ICollection<string> Roles { get; set; }
}