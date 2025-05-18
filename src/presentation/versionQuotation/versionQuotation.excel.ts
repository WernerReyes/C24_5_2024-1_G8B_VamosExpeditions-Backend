
import utils from "util";
import Exceljs from "exceljs";
import type { IHotelRoomTripDetailsModel, IVersionQuotationModel } from "@/infrastructure/models";

interface ReportOptions {
  dataQuey: IVersionQuotationModel;
}

export class VersionQuotationExcel {
  private colorWhite = "FFFFFF";
  private bacgroundColor = "01A3BB";
  private borderColor = "bbbbbb";
  private borderMedium = "medium" as Exceljs.BorderStyle;
  private borderStyle = {
    top: {
      style: this.borderMedium,
      color: { argb: this.borderColor },
    },
    left: {
      style: this.borderMedium,
      color: { argb: this.borderColor },
    },
    bottom: {
      style: this.borderMedium,
      color: { argb: this.borderColor },
    },
    right: {
      style: this.borderMedium,
      color: { argb: this.borderColor },
    },
  };

  constructor() {}

  private formatDateWithoutDay(dateString: string | Date): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  private generateTableContent({ trip_details }: IVersionQuotationModel) {
    const groupedData: Record<string, any[]> = {};

    const diffDays =
      trip_details?.start_date && trip_details?.end_date
        ? Math.abs(
            (new Date(trip_details.start_date).getTime() -
              new Date(trip_details.end_date).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 0;

    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(trip_details!.start_date);
      currentDate.setDate(currentDate.getDate() + i);

      const dayLabel = this.formatDateWithoutDay(currentDate);
      groupedData[dayLabel] = [];
    }

    trip_details?.hotel_room_trip_details?.forEach(
      (db: IHotelRoomTripDetailsModel) => {
        const dayLabel = this.formatDateWithoutDay(db.date);

        groupedData[dayLabel]?.push({
          Accommodation: db?.hotel_room?.hotel?.name,

          Room_type: db?.hotel_room?.room_type,

          People: db?.cost_person?.toString(),

          Preci_day: db?.hotel_room?.rate_usd
            ? `$ ${db.hotel_room.rate_usd.toFixed(2)}`
            : "-",
        });
      }
    );

    return groupedData;
  }



 // Generate Excel file with the data
  public async generateExcel(reportOptions: ReportOptions) {
    const { dataQuey } = reportOptions;
    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Version Quotation");

    worksheet.columns = [
      { header: "Day", key: "Day", width: 25 },
      { header: "Accommodation", key: "Accommodation", width: 45 },
      { header: "Room_type", key: "Room_type", width: 30 },
      { header: "People", key: "People", width: 10 },
      { header: "Preci_day", key: "Preci_day", width: 20 },
    ];
    const tableBody = this.generateTableContent(dataQuey);
    const PrecioTotal = dataQuey.final_price;

    Object.entries(tableBody).forEach(([day, entries], index) => {
      let rowIndex = worksheet.addRow([
        `Day ${index + 1} ${day})`,
        entries[0].Accommodation,
        entries[0].Room_type,
        entries[0].People,
        entries[0].Preci_day,
      ]).number;

      entries.slice(1).forEach((entry) => {
        worksheet.addRow([
          "",
          entry.Accommodation,
          entry.Room_type,
          entry.People,
          entry.Preci_day,
        ]);
      });

      worksheet.mergeCells(`A${rowIndex}:A${rowIndex + entries.length - 1}`);
    });

    worksheet.getColumn("Day").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    for (let col = 1; col <= worksheet.columns.length; col++) {
      const cell = worksheet.getCell(1, col);

      cell.alignment = { vertical: "middle", horizontal: "center" };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: this.bacgroundColor },
      };
      cell.font = {
        color: { argb: this.colorWhite },
        bold: true,
      };
    }

    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = this.borderStyle;

        const dayValue = row.getCell("Day").value;

        if (rowNumber === 1) return;

        const backgroundColor =
          rowNumber % 2 === 0 ? "F2F2F2" : this.colorWhite;

        if (dayValue === cell.value) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.bacgroundColor },
          };
          cell.font = {
            color: { argb: this.colorWhite },
            bold: true,
          };
          return;
        }
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: backgroundColor },
        };
      });
    });

    const TotalRow = worksheet.addRow([
      "",
      "",
      "",
      "TOTAL",
      `$ ${PrecioTotal}`,
    ]);
    TotalRow.eachCell((cell, colNumber) => {
      if (cell.value === "") {
        return;
      }
      cell.border = this.borderStyle;
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: this.bacgroundColor },
      };
      cell.font = {
        color: { argb: this.colorWhite },
        bold: true,
      };
    });

    //workbook.xlsx.writeFile("VersionQuotation.xlsx");
   
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
