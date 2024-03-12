using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace Selu383.SP24.Api.Features.Rooms
{
    public class RoomConfiguration : IEntityTypeConfiguration<Room>
    {
        public void Configure(EntityTypeBuilder<Room> builder)
        {
            builder.Property(x => x.Rate)
                .IsRequired();

            builder.Property(x => x.RoomNumber)
                .IsRequired();
        }
    }
}
