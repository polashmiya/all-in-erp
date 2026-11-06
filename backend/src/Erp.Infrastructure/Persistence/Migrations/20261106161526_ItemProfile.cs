using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Erp.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class ItemProfile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Item",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BarCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    HSCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ItemName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ItemDescription = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ItemTypeID = table.Column<int>(type: "int", nullable: false),
                    ItemTypeName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    ItemDepartmentID = table.Column<int>(type: "int", nullable: false),
                    ItemCategoryID = table.Column<int>(type: "int", nullable: false),
                    ItemSubCategoryID = table.Column<int>(type: "int", nullable: false),
                    ItemMinorCategoryID = table.Column<int>(type: "int", nullable: false),
                    SupplierID = table.Column<int>(type: "int", nullable: true),
                    SupplierName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    UomID = table.Column<int>(type: "int", nullable: false),
                    UomName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    AltUomID = table.Column<int>(type: "int", nullable: true),
                    AltUomName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    AltUomConversionQty = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    IsNoDecimalQty = table.Column<bool>(type: "bit", nullable: false),
                    AverageCostPrice = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    LastCostPrice = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    SalesPrice = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    PurchaseSupplyTypeID = table.Column<int>(type: "int", nullable: false),
                    PurchaseSupplyTypeName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PurchaseVatID = table.Column<int>(type: "int", nullable: true),
                    PurchaseVatPercentage = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    SalesSupplyTypeID = table.Column<int>(type: "int", nullable: false),
                    SalesSupplyTypeName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SalesVatID = table.Column<int>(type: "int", nullable: true),
                    SalesVatPercentage = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    SDPercentage = table.Column<decimal>(type: "decimal(18,4)", precision: 18, scale: 4, nullable: true),
                    isVatInclusive = table.Column<bool>(type: "bit", nullable: false),
                    isVatRebatable = table.Column<bool>(type: "bit", nullable: false),
                    isSaleAble = table.Column<bool>(type: "bit", nullable: false),
                    isPurchase = table.Column<bool>(type: "bit", nullable: false),
                    isNegativeSales = table.Column<bool>(type: "bit", nullable: false),
                    isMultipleSalesPrice = table.Column<bool>(type: "bit", nullable: false),
                    isAutoBarcode = table.Column<bool>(type: "bit", nullable: false),
                    isChaildBarCode = table.Column<bool>(type: "bit", nullable: false),
                    MasterItemID = table.Column<long>(type: "bigint", nullable: true),
                    BarCodeSerial = table.Column<int>(type: "int", nullable: true),
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
                    table.PrimaryKey("PK_Item", x => x.ItemID);
                    table.ForeignKey(
                        name: "FK_Item_Accounts_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Accounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_BusinessUnits_BusinessUnitID",
                        column: x => x.BusinessUnitID,
                        principalTable: "BusinessUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_ItemCategory_ItemCategoryID",
                        column: x => x.ItemCategoryID,
                        principalTable: "ItemCategory",
                        principalColumn: "ItemCategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_ItemDepartment_ItemDepartmentID",
                        column: x => x.ItemDepartmentID,
                        principalTable: "ItemDepartment",
                        principalColumn: "DepartmentID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_ItemMinorCategory_ItemMinorCategoryID",
                        column: x => x.ItemMinorCategoryID,
                        principalTable: "ItemMinorCategory",
                        principalColumn: "ItemMinorCategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_ItemSubCategory_ItemSubCategoryID",
                        column: x => x.ItemSubCategoryID,
                        principalTable: "ItemSubCategory",
                        principalColumn: "ItemSubCategoryID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_UnitOfMeasure_AltUomID",
                        column: x => x.AltUomID,
                        principalTable: "UnitOfMeasure",
                        principalColumn: "UomID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Item_UnitOfMeasure_UomID",
                        column: x => x.UomID,
                        principalTable: "UnitOfMeasure",
                        principalColumn: "UomID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Item_AccountID",
                table: "Item",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_AltUomID",
                table: "Item",
                column: "AltUomID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_BarCode",
                table: "Item",
                column: "BarCode");

            migrationBuilder.CreateIndex(
                name: "IX_Item_BusinessUnitID_ItemCode",
                table: "Item",
                columns: new[] { "BusinessUnitID", "ItemCode" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemCategoryID",
                table: "Item",
                column: "ItemCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemDepartmentID",
                table: "Item",
                column: "ItemDepartmentID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemMinorCategoryID",
                table: "Item",
                column: "ItemMinorCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_ItemSubCategoryID",
                table: "Item",
                column: "ItemSubCategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Item_UomID",
                table: "Item",
                column: "UomID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Item");
        }
    }
}
