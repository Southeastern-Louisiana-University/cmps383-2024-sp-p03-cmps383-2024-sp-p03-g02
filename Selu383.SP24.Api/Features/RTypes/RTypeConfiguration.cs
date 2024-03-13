using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Selu383.SP24.Api.Features.RTypes
{
    public class RTypeConfiguration : IEntityTypeConfiguration<RType>
    {
        public void Configure(EntityTypeBuilder<RType> builder)
        {
            builder.Property(x => x.Name)
                .IsRequired();

            builder.Property(x => x.Description)
                .IsRequired();
        }
    }
}