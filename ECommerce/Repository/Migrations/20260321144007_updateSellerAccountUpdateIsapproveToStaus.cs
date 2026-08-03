using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class updateSellerAccountUpdateIsapproveToStaus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsApproved",
                table: "SellerProfiles");

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "SellerProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Status",
                table: "SellerProfiles");

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                table: "SellerProfiles",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
