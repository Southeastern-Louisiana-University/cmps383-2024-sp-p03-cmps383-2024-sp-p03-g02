using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.RTypes;

namespace Selu383.SP24.Api.Controllers
{
    [Route("api/roomTypes")]
    [ApiController]
    public class RTypesController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly DbSet<RType> types;

        public RTypesController(DataContext dataContext)
        {
            _dataContext = dataContext;
            types = dataContext.Set<RType>();
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var allTypes = types
                .Select(x => new RTypeDto
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    Capacity = x.Capacity,
                    CommonItems = x.CommonItems
                })
                .ToList();

            return Ok(allTypes);
        }

        [HttpGet("{id:int}")]
        public IActionResult GetbyId(int id)
        {
            var targetType = types.FirstOrDefault(x => x.Id == id);

            if (targetType == null)
            {
                return NotFound();
            }

            var typeToReturn = new RTypeDto
            {
                Id = id,
                Name = targetType.Name,
                Description = targetType.Description,
                Capacity = targetType.Capacity,
                CommonItems = targetType.CommonItems
            };

            return Ok(typeToReturn);
        }

        [HttpPost]
        [Authorize(Roles = RoleNames.Admin)]
        public IActionResult CreateCity(RTypeDto dto)
        {
            if (dto.Name == null || dto.Description == null || dto.Capacity <= 1)
            {
                return BadRequest("Name, Description, and Capacity are required.");
            }

            var type = new RType
            {
                Name = dto.Name,
                Description = dto.Description,
                Capacity = dto.Capacity,
                CommonItems = CommonList.CommonItems
            };

            types.Add(type);
            _dataContext.SaveChanges();

            var typeToReturn = new RTypeDto
            {
                Id = type.Id,
                Name = type.Name,
                Description = type.Description,
                Capacity = type.Capacity,
                CommonItems = type.CommonItems
            };

            return CreatedAtAction(nameof(GetbyId), new { id = typeToReturn.Id }, typeToReturn);
        }

        [HttpPut("{id:int}")]
        [Authorize(Roles = RoleNames.Admin)]
        public IActionResult PutCity([FromBody] RTypeUpdateDto dto, [FromRoute] int id)
        {
            var targetType = types.FirstOrDefault(x => x.Id == id);

            if (targetType == null)
            {
                return NotFound();
            }

            if (dto.Name == null || dto.Description == null || dto.Capacity <= 1)
            {
                return BadRequest("Name, Description, and Capacity are required.");
            }

            targetType.Name = dto.Name;
            targetType.Description = dto.Description;
            targetType.Capacity = dto.Capacity;
            targetType.CommonItems = CommonList.CommonItems;

            _dataContext.SaveChanges();

            var typeToReturn = new RTypeDto
            {
                Id = targetType.Id,
                Name = targetType.Name,
                Description = targetType.Description,
                Capacity = targetType.Capacity,
                CommonItems = targetType.CommonItems
            };

            return Ok(typeToReturn);
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = RoleNames.Admin)]
        public IActionResult DeleteCity([FromRoute] int id)
        {
            var typeToDelete = types.FirstOrDefault(x => x.Id == id);

            if (typeToDelete == null)
            {
                return NotFound();
            }

            types.Remove(typeToDelete);
            _dataContext.SaveChanges();

            var typeToReturn = new RTypeDto
            {
                Id = typeToDelete.Id,
                Name = typeToDelete.Name,
                Description = typeToDelete.Description,
                Capacity = typeToDelete.Capacity,
                CommonItems = typeToDelete.CommonItems
            };

            return Ok(typeToDelete);
        }
    }
}
