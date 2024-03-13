using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Data;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Cities;

namespace Selu383.SP24.Api.Controllers;

[Route("api/cities")]
[ApiController]
public class CitiesController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly DbSet<City> cities;

    public CitiesController(DataContext dataContext)
    {
        _dataContext = dataContext;
        cities = dataContext.Set<City>();
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var allCities = cities.
            Select(x => new CityDto
            {
                Id = x.Id,
                Name = x.Name,
            })
            .ToList();

        return Ok(allCities);
    }

    [HttpGet("{id:int}")]
    public IActionResult GetbyId(int id)
    {
        var targetCity = cities.FirstOrDefault(x => x.Id == id);

        if (targetCity == null)
        {
            return NotFound();
        }

        var cityToReturn = new CityDto
        {
            Id = id,
            Name = targetCity.Name,
        };
        return Ok(cityToReturn);
    }

    [HttpPost]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult CreateCity(CityDto dto)
    {
        var city = new City
        {
            Name = dto.Name,
        };

        cities.Add(city);
        _dataContext.SaveChanges();

        var cityToReturn = new CityDto
        {
            Id = city.Id,
            Name = city.Name,
        };

        return CreatedAtAction(nameof(GetbyId), new { id = cityToReturn.Id }, cityToReturn);
    }

    [HttpPut("{id:int}")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult PutCity([FromBody] CityUpdateDto dto, [FromRoute] int id)
    {
        var targetCity = cities
            .FirstOrDefault(x => x.Id == id);

        if (targetCity == null)
        {
            return NotFound();
        }

        targetCity.Name = dto.Name;

        _dataContext.SaveChanges();

        var cityToReturn = new CityDto
        {
            Id = targetCity.Id,
            Name = targetCity.Name
        };
        return Ok(cityToReturn);
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = RoleNames.Admin)]
    public IActionResult DeleteCity([FromRoute] int id)
    {
        var cityToDelete = cities.
            FirstOrDefault(x => x.Id == id);

        if (cityToDelete == null)
        {
            return NotFound();
        }
        cities.Remove(cityToDelete);
        _dataContext.SaveChanges();

        var cityToReturn = new CityDto
        {
            Id = cityToDelete.Id,
            Name = cityToDelete.Name
        };

        return Ok(cityToDelete);
    }
}
