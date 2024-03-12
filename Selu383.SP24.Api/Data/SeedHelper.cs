using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Features.Authorization;
using Selu383.SP24.Api.Features.Cities;
using Selu383.SP24.Api.Features.Hotels;
using Selu383.SP24.Api.Features.Rooms;
using Selu383.SP24.Api.Features.RTypes;

namespace Selu383.SP24.Api.Data;

public static class SeedHelper
{
    public static async Task MigrateAndSeed(IServiceProvider serviceProvider)
    {
        var dataContext = serviceProvider.GetRequiredService<DataContext>();

        await dataContext.Database.MigrateAsync();

        await AddRoles(serviceProvider);
        await AddUsers(serviceProvider);
        await AddCities(dataContext);
        await AddTypes(dataContext);
        /*await AddHotels(dataContext);*/
/*        await AddRooms(dataContext);*/
    }

    private static async Task AddUsers(IServiceProvider serviceProvider)
    {
        const string defaultPassword = "Password123!";
        var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

        if (userManager.Users.Any())
        {
            return;
        }

        var adminUser = new User
        {
            UserName = "galkadi"
        };
        await userManager.CreateAsync(adminUser, defaultPassword);
        await userManager.AddToRoleAsync(adminUser, RoleNames.Admin);

        var bob = new User
        {
            UserName = "bob"
        };
        await userManager.CreateAsync(bob, defaultPassword);
        await userManager.AddToRoleAsync(bob, RoleNames.User);

        var sue = new User
        {
            UserName = "sue"
        };
        await userManager.CreateAsync(sue, defaultPassword);
        await userManager.AddToRoleAsync(sue, RoleNames.User);
    }

    private static async Task AddRoles(IServiceProvider serviceProvider)
    {
        var roleManager = serviceProvider.GetRequiredService<RoleManager<Role>>();
        if (roleManager.Roles.Any())
        {
            return;
        }
        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.Admin
        });

        await roleManager.CreateAsync(new Role
        {
            Name = RoleNames.User
        });
    }

    private static async Task AddCities(DataContext dataContext)
    {
        var cities = dataContext.Set<City>();
        if (await cities.AnyAsync())
        {
            return;
        }

        dataContext.Set<City>()
            .Add(new City
            {
                Name = "Hammond"
            });

        dataContext.Set<City>()
            .Add(new City
            {
                Name = "New Orleans"
            });

        dataContext.Set<City>()
            .Add(new City
            {
                Name = "Baton Rouge"
            });
        await dataContext.SaveChangesAsync();
    }

    private static async Task AddTypes(DataContext dataContext)
    {
        var types = dataContext.Set<RType>();
        if (await types.AnyAsync())
        {
            return;
        }

        dataContext.Set<RType>()
            .Add(new RType
            {
                Name = "Single Queen",
                Description = "Room with one queen bed"
            });

        dataContext.Set<RType>()
            .Add(new RType
            {
                Name = "Double Queen",
                Description = "Room with two queen beds"
            });


        await dataContext.SaveChangesAsync();
    }

    /*private static async Task AddHotels(DataContext dataContext)
    {
        var hotels = dataContext.Set<Hotel>();

        if (await hotels.AnyAsync())
        {
            return;
        }

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "The Grand Motel",
                    Address = "1234 Place St",
                    ManagerId = 2,
                    LocationId = 2,
                    Image = "",
                    ContactNumber = "18009999999",
                    Email = "grandmotel@gmail.com"
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Nice Suites",
                    Address = "1234 Place Ave",
                    ManagerId = 3,
                    LocationId = 2,
                    Image = "",
                    ContactNumber = "18007896087",
                    Email = "nicesuites@gmail.com"
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Plaza Hotel",
                    Address = "12 Plack St",
                    ManagerId = 3,
                    LocationId = 2,
                    Image = "",
                    ContactNumber = "18007516238",
                    Email = "plazahotel@gmail.com"
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name ="Quality Hotel",
                    Address = "234 Venue Ave",
                    ManagerId = 3,
                    LocationId = 3,
                    Image = "",
                    ContactNumber = "18003517345",
                    Email = "qualityhotels@gmail.com"
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "La Vigesimo Séptima Inn",
                    Address = "5382 Gerry Ln",
                    ManagerId = 3,
                    LocationId = 3,
                    Image = "",
                    ContactNumber = "18001234567",
                    Email = "septimainn@gmail.com"
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Hotel 7",
                    Address = "4 Ferry Ln",
                    ManagerId = 3,
                    LocationId = 3,
                    Image = "",
                    ContactNumber = "18007654321",
                    Email = "hotel7@gmail.com"
                });
        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Better Eastern",
                    Address = "1 First St",
                    ManagerId = 3,
                    LocationId = 4,
                    Image = "",
                    ContactNumber = "18003421642",
                    Email = "better@gmail.com"
                });
        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Night Inn and Suites",
                    Address = "1234 Place st",
                    ManagerId = 3,
                    LocationId = 4,
                    Image = "",
                    ContactNumber = "18001237654",
                    Email = "nigthinn@gmail.com"
                });
        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "The Town Inn",
                    Address = "12 Plaque Rd",
                    ManagerId = 3,
                    LocationId = 4,
                    Image = "",
                    ContactNumber = "18009996721",
                    Email = "towninn@gmail.com"
                });

        await dataContext.SaveChangesAsync();
    }*/

/*    private static async Task AddRooms(DataContext dataContext)
    {
        var rooms = dataContext.Set<Room>();

        if (await rooms.AnyAsync())
        {
            return;
        }

        for (int i = 6; i <= 14; i++)
        {
            for (int j = 100; j < 105; j++)
            {
                dataContext.Set<Room>()
                .Add(new Room
                {
                    HotelId = i,
                    Rate = 100,
                    RoomNumber = j,
                    Image = "",
                    RTypeId = 1,
                });
            }
            for (int k = 200; k < 205; k++)
            {
                dataContext.Set<Room>()
                .Add(new Room
                {
                    HotelId = i,
                    Rate = 150,
                    RoomNumber = k,
                    Image = "",
                    RTypeId = 2,
                });
            }
        }
*//*
        await dataContext.SaveChangesAsync();
    }
*/
}
