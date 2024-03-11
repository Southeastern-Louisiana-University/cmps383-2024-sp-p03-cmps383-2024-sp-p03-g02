using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Selu383.SP24.Api.Migrations
{
    /// <inheritdoc />
    public partial class RoomEdits : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RTypeId",
                table: "Room",
                type: "int",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "RType",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Room_RTypeId",
                table: "Room",
                column: "RTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Room_RType_RTypeId",
                table: "Room",
                column: "RTypeId",
                principalTable: "RType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Room_RType_RTypeId",
                table: "Room");

            migrationBuilder.DropTable(
                name: "RType");

            migrationBuilder.DropIndex(
                name: "IX_Room_RTypeId",
                table: "Room");

            migrationBuilder.DropColumn(
                name: "RTypeId",
                table: "Room");
        }
    }
}
