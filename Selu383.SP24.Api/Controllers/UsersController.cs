using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Features.Authorization;

namespace Selu383.SP24.Api.Controllers
{
    [ApiController]
    [Route("api/users/getAll")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> userManager;

        public UsersController(UserManager<User> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await userManager.Users.ToListAsync();
            var userDtos = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = roles.ToList()
                };
                userDtos.Add(userDto);
            }

            return Ok(userDtos);
        }


        [HttpGet("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = await userManager.GetRolesAsync(user)
            };

            return Ok(userDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDto>> UpdateUser(int id, UpdateUserDto dto)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            user.UserName = dto.UserName;

            if (dto.Roles != null)
            {
                var currentRoles = await userManager.GetRolesAsync(user);
                var removeResult = await userManager.RemoveFromRolesAsync(user, currentRoles);
                if (!removeResult.Succeeded)
                {
                    return BadRequest(removeResult.Errors);
                }

                var addResult = await userManager.AddToRolesAsync(user, dto.Roles);
                if (!addResult.Succeeded)
                {
                    return BadRequest(addResult.Errors);
                }
            }

            var updateResult = await userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return BadRequest(updateResult.Errors);
            }

            var updatedUserDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = dto.Roles.ToList() 
            };

            return Ok(updatedUserDto);
        }


        [HttpDelete("{id}")]
        [Authorize(Roles = RoleNames.Admin)]
        public async Task<ActionResult<UserDto>> DeleteUser(int id)
        {
            var user = await userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var userRoles = await userManager.GetRolesAsync(user);
            var deleteResult = await userManager.DeleteAsync(user);
            if (!deleteResult.Succeeded)
            {
                return BadRequest(deleteResult.Errors);
            }

            var deletedUserDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Roles = userRoles.ToList()
            };

            return Ok(deletedUserDto);
        }
    }
}
