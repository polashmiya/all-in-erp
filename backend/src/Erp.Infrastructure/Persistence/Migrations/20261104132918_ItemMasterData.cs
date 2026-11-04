using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ItemMasterData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ItemDepartment",
                columns: table => new
                {
                    DepartmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DepartmentName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartmentCode = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Serial = table.Column<int>(type: "int", nullable: true),
                    ImageSource = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessUnitID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemDepartment", x => x.DepartmentID);
                    table.ForeignKey(
                        name: "FK_ItemDepartment_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemDepartment_BusinessUnits_BusinessUnitID",
                        column: x => x.BusinessUnitID,
                        principalTable: "BusinessUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UnitOfMeasure",
                columns: table => new
                {
                    UomID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UomCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UomName = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    UomDescription = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    RoundingLen = table.Column<int>(type: "int", nullable: true),
                    isDecimalAllowed = table.Column<bool>(type: "bit", nullable: false),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BranchID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UnitOfMeasure", x => x.UomID);
                    table.ForeignKey(
                        name: "FK_UnitOfMeasure_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemCategory",
                columns: table => new
                {
                    ItemCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemCategoryCode = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    ItemCategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ItemDepartmentID = table.Column<int>(type: "int", nullable: false),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessUnitID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageSource = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemCategory", x => x.ItemCategoryID);
                    table.ForeignKey(
                        name: "FK_ItemCategory_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemCategory_BusinessUnits_BusinessUnitID",
                        column: x => x.BusinessUnitID,
                        principalTable: "BusinessUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemCategory_ItemDepartment_ItemDepartmentID",
                        column: x => x.ItemDepartmentID,
                        principalTable: "ItemDepartment",
                        principalColumn: "DepartmentID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemSubCategory",
                columns: table => new
                {
                    ItemSubCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemSubCategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartmentID = table.Column<int>(type: "int", nullable: true),
                    ItemCategoryID = table.Column<int>(type: "int", nullable: false),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessUnitID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageSource = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemSubCategory", x => x.ItemSubCategoryID);
                    table.ForeignKey(
                        name: "FK_ItemSubCategory_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemSubCategory_BusinessUnits_BusinessUnitID",
                        column: x => x.BusinessUnitID,
                        principalTable: "BusinessUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemSubCategory_ItemCategory_ItemCategoryID",
                        column: x => x.ItemCategoryID,
                        principalTable: "ItemCategory",
                        principalColumn: "ItemCategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemSubCategory_ItemDepartment_DepartmentID",
                        column: x => x.DepartmentID,
                        principalTable: "ItemDepartment",
                        principalColumn: "DepartmentID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ItemMinorCategory",
                columns: table => new
                {
                    ItemMinorCategoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemMinorCategoryName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ItemCategoryID = table.Column<int>(type: "int", nullable: false),
                    ItemSubCategoryID = table.Column<int>(type: "int", nullable: false),
                    AccountID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    BusinessUnitID = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImageSource = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    isActive = table.Column<bool>(type: "bit", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    CreatedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedByID = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    ModifiedAt = table.Column<DateTime>(type: "datetime", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemMinorCategory", x => x.ItemMinorCategoryID);
                    table.ForeignKey(
                        name: "FK_ItemMinorCategory_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemMinorCategory_BusinessUnits_BusinessUnitID",
                        column: x => x.BusinessUnitID,
                        principalTable: "BusinessUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemMinorCategory_ItemCategory_ItemCategoryID",
                        column: x => x.ItemCategoryID,
                        principalTable: "ItemCategory",
                        principalColumn: "ItemCategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ItemMinorCategory_ItemSubCategory_ItemSubCategoryID",
                        column: x => x.ItemSubCategoryID,
                        principalTable: "ItemSubCategory",
                        principalColumn: "ItemSubCategoryID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ItemCategory_AccountID",
                table: "ItemCategory",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemCategory_BusinessUnitID_ItemCategoryCode",
                table: "ItemCategory",
                columns: new[] { "BusinessUnitID", "ItemCategoryCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemCategory_ItemDepartmentID_ItemCategoryName",
                table: "ItemCategory",
                columns: new[] { "ItemDepartmentID", "ItemCategoryName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemDepartment_AccountID",
                table: "ItemDepartment",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemDepartment_BusinessUnitID_DepartmentCode",
                table: "ItemDepartment",
                columns: new[] { "BusinessUnitID", "DepartmentCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemDepartment_BusinessUnitID_DepartmentName",
                table: "ItemDepartment",
                columns: new[] { "BusinessUnitID", "DepartmentName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemMinorCategory_AccountID",
                table: "ItemMinorCategory",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMinorCategory_BusinessUnitID",
                table: "ItemMinorCategory",
                column: "BusinessUnitID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMinorCategory_ItemCategoryID",
                table: "ItemMinorCategory",
                column: "ItemCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemMinorCategory_ItemSubCategoryID_ItemMinorCategoryName",
                table: "ItemMinorCategory",
                columns: new[] { "ItemSubCategoryID", "ItemMinorCategoryName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ItemSubCategory_AccountID",
                table: "ItemSubCategory",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemSubCategory_BusinessUnitID",
                table: "ItemSubCategory",
                column: "BusinessUnitID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemSubCategory_DepartmentID",
                table: "ItemSubCategory",
                column: "DepartmentID");

            migrationBuilder.CreateIndex(
                name: "IX_ItemSubCategory_ItemCategoryID_ItemSubCategoryName",
                table: "ItemSubCategory",
                columns: new[] { "ItemCategoryID", "ItemSubCategoryName" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UnitOfMeasure_AccountID_UomCode",
                table: "UnitOfMeasure",
                columns: new[] { "AccountID", "UomCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UnitOfMeasure_AccountID_UomName",
                table: "UnitOfMeasure",
                columns: new[] { "AccountID", "UomName" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ItemMinorCategory");

            migrationBuilder.DropTable(
                name: "UnitOfMeasure");

            migrationBuilder.DropTable(
                name: "ItemSubCategory");

            migrationBuilder.DropTable(
                name: "ItemCategory");

            migrationBuilder.DropTable(
                name: "ItemDepartment");
        }
    }
}
