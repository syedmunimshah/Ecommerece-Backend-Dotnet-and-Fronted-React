using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Repository.Migrations
{
    /// <inheritdoc />
    public partial class SyncOtpDropRefreshTokens : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                IF COL_LENGTH('Users', 'PasswordResetToken') IS NULL
                    ALTER TABLE Users ADD PasswordResetToken nvarchar(max) NULL;

                IF COL_LENGTH('Users', 'PasswordResetTokenExpiry') IS NULL
                    ALTER TABLE Users ADD PasswordResetTokenExpiry datetime2 NULL;

                IF COL_LENGTH('Users', 'OtpDailyRequestCount') IS NULL
                    ALTER TABLE Users ADD OtpDailyRequestCount int NOT NULL CONSTRAINT DF_Users_OtpDailyRequestCount DEFAULT 0;

                IF COL_LENGTH('Users', 'OtpDailyRequestDate') IS NULL
                    ALTER TABLE Users ADD OtpDailyRequestDate datetime2 NULL;

                IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'RefreshTokens')
                    DROP TABLE RefreshTokens;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "OtpDailyRequestDate", table: "Users");
            migrationBuilder.DropColumn(name: "OtpDailyRequestCount", table: "Users");
            migrationBuilder.DropColumn(name: "PasswordResetTokenExpiry", table: "Users");
            migrationBuilder.DropColumn(name: "PasswordResetToken", table: "Users");
        }
    }
}
