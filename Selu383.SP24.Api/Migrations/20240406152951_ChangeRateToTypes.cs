using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP24.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeRateToTypes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rate",
                table: "Room");

            migrationBuilder.AddColumn<int>(
                name: "Rate",
                table: "RType",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rate",
                table: "RType");

            migrationBuilder.AddColumn<int>(
                name: "Rate",
                table: "Room",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
