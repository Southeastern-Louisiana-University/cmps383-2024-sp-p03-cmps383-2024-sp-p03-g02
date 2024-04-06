using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Selu383.SP24.Api.Features.Authorization;
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
        await AddTypes(dataContext);
        await AddHotels(dataContext);
        await AddRooms(dataContext);
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
                Description = "Room with one queen bed",
                CommonItems = CommonList.CommonItems,
                Capacity = 2,
                Rate = 100
            });

        dataContext.Set<RType>()
            .Add(new RType
            {
                Name = "Double Queen",
                Description = "Room with two queen beds",
                CommonItems = CommonList.CommonItems,
                Capacity = 4,
                Rate = 200
            });
        dataContext.Set<RType>()
            .Add(new RType
            {
                Name = "Single King",
                Description = "Room with one king bed",
                CommonItems = CommonList.CommonItems,
                Capacity = 2,
                Rate = 300
            });

        await dataContext.SaveChangesAsync();
    }

    private static async Task AddHotels(DataContext dataContext)
    {
        var hotels = dataContext.Set<Hotel>();

        if (await hotels.AnyAsync())
        {
            return;
        }

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Baronne Hotel",
                    Address = "225 Baronne St, New Orleans, LA 70112",
                    Image = "https://imgur.com/MLARzB8.png",
                    ContactNumber = "18009999999",
                    Email = "baronne@gmail.com",
                    ManagerId = 2
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Esplanade Hotel",
                    Address = "405 Esplanade Ave, New Orleans, LA 70116",
                    Image = "https://imgur.com/MLARzB8.png",
                    ContactNumber = "18007896087",
                    Email = "esplanade@gmail.com",
                    ManagerId = 2
                });

        dataContext.Set<Hotel>()
                .Add(new Hotel
                {
                    Name = "Convention Hotel",
                    Address = "200 Convention St, Baton Rouge, LA 70801",
                    Image = "https://imgur.com/MLARzB8.png",
                    ContactNumber = "18007516238",
                    Email = "conventionhotel@gmail.com",
                    ManagerId = 2
                });

        await dataContext.SaveChangesAsync();
    }

    private static async Task AddRooms(DataContext dataContext)
    {
        var rooms = dataContext.Set<Room>();

        if(await rooms.AnyAsync())
        {
            return;
        }

        for (var i = 1; i < 4; i++)
        {
            for (var j = 1; j < 4; j++)
            {
                rooms.Add(new Room
                {
                    HotelId = i,
                    RoomNumber = j + 100,
                    RTypeId = j,
                    Image = "https://i.imgur.com/sTESIUA.jpg",
                });
            }
        }

        await dataContext.SaveChangesAsync();
    }

}
