using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP24.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCityToHotel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Hotel",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hotel_LocationId",
                table: "Hotel",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotel_City_LocationId",
                table: "Hotel",
                column: "LocationId",
                principalTable: "City",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotel_City_LocationId",
                table: "Hotel");

            migrationBuilder.DropIndex(
                name: "IX_Hotel_LocationId",
                table: "Hotel");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Hotel");
        }
    }
}
