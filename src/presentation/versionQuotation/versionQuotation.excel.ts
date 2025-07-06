import utils from "util";
import Exceljs from "exceljs";
import fs from "fs";
import type {
  IHotelRoomTripDetailsModel,
  IServiceTripDetailsModel,
  IVersionQuotationModel,
} from "@/infrastructure/models";

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
    interface AlojamientosEntry {
      Accommodation: string;
      //TODO :Room_type: string;
      Preci_day: string;
    }
    interface ServiciosEntry {
      Description: string;
      Preci_day: string;
    }
    const groupedData: Record<
      string,
      {
        Alojamientos: AlojamientosEntry[];
        Servicios: ServiciosEntry[];
      }
    > = {};

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
      groupedData[dayLabel] = {
        Alojamientos: [],
        Servicios: [],
      };
    }
    //trip_details.
    trip_details?.service_trip_details?.forEach(
      (db: IServiceTripDetailsModel) => {
        const dayLabel = this.formatDateWithoutDay(db.date);
        /* console.log(
        "Formatted Date",
        utils.inspect(dayLabel, { depth: null, colors: true })
      ); */
        groupedData[dayLabel]?.Servicios.push({
          Description: db?.service?.description ? `[Ciudad ${db.service?.distrit?.city?.name}]   ${db.service.description}`: "-",
          //!People: db?.cost_person?.toString(),
          Preci_day: db?.cost_person ? `${db.cost_person.toFixed(2)}` : "-",
        });
      }
    );
    
    

    trip_details?.hotel_room_trip_details?.forEach(
      (db: IHotelRoomTripDetailsModel) => {
    
        console.log(db.hotel_room?.hotel?.distrit?.city?.name)

        const dayLabel = this.formatDateWithoutDay(db.date);
        groupedData[dayLabel]?.Alojamientos.push({
          Accommodation: db?.hotel_room?.hotel?.name
            ? `[Ciudad ${db.hotel_room?.hotel?.distrit?.city?.name}]-${db.hotel_room.hotel.name}-${db.hotel_room.room_type}`
            : "-",
          //TODO: Room_type: db?.hotel_room?.room_type ? db.hotel_room.room_type : "-",
          //!People: db?.cost_person?.toString(),
          Preci_day: db?.hotel_room?.rate_usd
            ? `${db.hotel_room.rate_usd.toFixed(2)}`
            : "-",
        });
      }
    );
    
    
    /* const data = groupedData;
    console.log(
      "AloJamiento",
      utils.inspect(data, { depth: null, colors: true })
    ); */
    return groupedData;
  }

  //! Generate Excel file with the data
  public async generateExcel(reportOptions: ReportOptions) {
    const { dataQuey } = reportOptions;
    //console.log(utils.inspect(dataQuey,{depth:null,colors:true}))


    const workbook = new Exceljs.Workbook();
    const worksheet = workbook.addWorksheet("Version Quotation");
    const imageId = workbook.addImage({
      buffer: fs.readFileSync("public/images/logo_1.png"),
      extension: "png",
    });

    //! merge cells
    worksheet.mergeCells("A1:A4");
    /* worksheet.mergeCells("C2:D2");
    worksheet.mergeCells("C3:D3"); */
    /* worksheet.mergeCells("B6:C6"); */

    worksheet.addImage(imageId, {
      tl: { col: 0, row: 0 },
      ext: { width: 150, height: 90 },
      editAs: "oneCell",
    });

    const cellPhone = worksheet.getCell("C2");

    cellPhone.value = 51987524304;
    cellPhone.numFmt = '"+"#';

    worksheet.getCell("A8").value = "Información del cliente";
    worksheet.getCell("A9").value = "Nombre:";
    worksheet.getCell("A10").value = dataQuey.trip_details?.client?.fullName
      ? dataQuey.trip_details?.client?.fullName
      : "No asignado";
    worksheet.getCell("A11").value = "Email:";
    worksheet.getCell("A12").value = {
      text: dataQuey.trip_details?.client?.email
        ? dataQuey.trip_details?.client?.email
        : "No asignado",
      hyperlink: `mailto:${dataQuey.trip_details?.client?.email}`,
      tooltip: "Enviar correo electrónico",
    };
    worksheet.getCell("C9").value = "Teléfono:";
    worksheet.getCell("C10").value = dataQuey.trip_details?.client?.phone
      ? dataQuey.trip_details?.client?.phone
      : "No asignado";
    worksheet.getCell("C11").value = "País:";
    worksheet.getCell("C12").value = dataQuey.trip_details?.client?.country
      ? dataQuey.trip_details?.client?.country
      : "No asignado";

    const txtName = worksheet.getCell("B6");
    txtName.value = dataQuey.name ? dataQuey.name : "No asignado";

    const cellUrl = worksheet.getCell("C3");
    cellUrl.value = {
      text: "https://vamosexpeditions.com/",
      hyperlink: "https://vamosexpeditions.com/",
      tooltip: "Visit VAMOS Expeditions",
    };

    worksheet.getRow(15).values = ["Day"];
    worksheet.getRow(15).font = { bold: true };
    worksheet.getRow(15).alignment = { horizontal: "center" };

    worksheet.columns = [
      { key: "Day", width: 25 },
      { key: "Description", width: 60 },
      { key: "Price", width: 23 },
    ];    
    const tableBody = this.generateTableContent(dataQuey);
    //?console.log(utils.inspect(tableBody, { depth: null, colors: true }));
    
    console.log(utils.inspect(tableBody,{depth:null,colors:true}));

    const PrecioTotal = dataQuey.final_price;
    //! Generate the table rows based on the data
    Object.entries(tableBody).forEach(([day, entries], index) => {
      const alojamientoLength = entries.Alojamientos.length;
      const serviciosLength = entries.Servicios.length;

      const rowIndex = worksheet.addRow([
        `Day ${index + 1} ${day}`,
        alojamientoLength > 0 ? "Alojamientos" : "",
        "",
      ]);
      worksheet.mergeCells(`B${rowIndex.number}:C${rowIndex.number}`);

      if (!entries || (alojamientoLength === 0 && serviciosLength === 0)) {
        const emptyRow = worksheet.addRow([`Day ${index + 1} ${day})`, "", ""]);
        worksheet.mergeCells(
          `A${emptyRow.number}:A${worksheet.lastRow?.number}`
        );
        return;
      }
      //TODO :const startRowNumber = (worksheet.lastRow?.number ?? 0) + 1 || 2;

      //! Add Alojamientos rows

      entries.Alojamientos.forEach((entry) => {
        const row = worksheet.addRow([
          "",
          entry.Accommodation,
          parseFloat(entry.Preci_day),
        ]);
        row.getCell(3).numFmt = '"$"#,##0.00';
      });

      //! Add Servicios rows (if you want to display them in the same table)
      if (serviciosLength > 0) {
        const serviceTitleRow = worksheet.addRow(["", "Servicios"]);
        serviceTitleRow.getCell(2).font = { bold: true };
        worksheet.mergeCells(
          `B${serviceTitleRow.number}:C${serviceTitleRow.number}`
        );
        //console.log(serviceTitleRow.number)
      }
      entries.Servicios.forEach((entry) => {
        const row = worksheet.addRow([
          "",
          entry.Description,
          parseFloat(entry.Preci_day),
        ]);
        row.getCell(3).numFmt = '"$"#,##0.00';
      });
      //! SubTotal for Alojamientos and Servicios
      if (alojamientoLength > 0 || serviciosLength > 0) {
        const subTotalRow = worksheet.addRow([
          "",
          "SubTotal:",
          entries.Alojamientos.reduce(
            (acc, entry) => acc + parseFloat(entry.Preci_day),
            0
          ) +
            entries.Servicios.reduce(
              (acc, entry) => acc + parseFloat(entry.Preci_day),
              0
            ),
        ]);
        subTotalRow.getCell(3).numFmt = '"$"#,##0.00';
      }

      //! Merge the "Day" cell for all rows added for this day
      worksheet.mergeCells(`A${rowIndex.number}:A${worksheet.lastRow?.number}`);
    });

    worksheet.getColumn("Day").alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    //! color de fondo y bordes de A1:D4
    this.applyBackgroundFill(
      worksheet,
      1,
      4,
      1,
      3,
      this.bacgroundColor,
      "right",
      this.colorWhite
    );
    //! color de fondo y bordes de A5:D7
    this.applyBackgroundFill(
      worksheet,
      5,
      7,
      1,
      3,
      "FFFFFFFF",
      "center",
      this.bacgroundColor
    );

    //! color de fondo y bordes de A8:D12
    this.applyBackgroundFill(
      worksheet,
      8,
      12,
      1,
      3,
      "F5F5F5",
      "left",
      this.bacgroundColor
    );
    //! color de fondo y bordes de A13:D14
    this.applyBackgroundFill(worksheet, 13, 14, 1, 3, "FFFFFFFF");
    //! color de fondo y bordes de A15:D15

    txtName.font = {
      bold: true,
      size: 20,
      color: { argb: this.bacgroundColor },
    };

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber < 15) return;

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        //! Limitar solo a columnas A(1) a D(4)
        if (colNumber > 15) return;
        //! Aplicar bordes
        cell.border = this.borderStyle;
        //! Determinar color de fondo alternado
        const backgroundColor =
          rowNumber % 2 === 0 ? "F2F2F2" : this.colorWhite;
        //! Detectar si es la celda con el valor del día (para pintarla diferente)
        const dayValue = row.getCell("Day").value;
        //

        if (
          dayValue === cell.value ||
          cell.value === "Servicios" ||
          cell.value === "Alojamientos" ||
          cell.value === "SubTotal:"
        ) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
              argb: cell.value === "SubTotal:" ? "E5F8FB" : this.bacgroundColor,
            },
          };
          cell.font = {
            color: {
              argb: cell.value === "SubTotal:" ? "000000" : this.colorWhite,
            },
            bold: true,
          };
        } else {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: backgroundColor },
          };
        }
      });
    });

    const TotalRow = worksheet.addRow([
      "",
      "TOTAL",
      PrecioTotal !== null && PrecioTotal !== undefined
        ? parseFloat(PrecioTotal as any)
        : 0,
    ]);

    TotalRow.getCell(3).numFmt = '"$"#,##0.00';
    TotalRow.eachCell((cell) => {
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
    //! Aplicar fondo y alineación centrada con color blanco
    this.applyBackgroundFill(
      worksheet,
      TotalRow.number + 4,
      TotalRow.number + 6,
      1,
      3,
      this.bacgroundColor,
      "left",
      "FFFFFF"
    );

    worksheet.getCell(`A${TotalRow.number + 4}`).value = "Realizado por:";
    worksheet.getCell(`A${TotalRow.number + 5}`).value = dataQuey?.user
      ?.fullname
      ? dataQuey?.user?.fullname
      : "";
    worksheet.getCell(`A${TotalRow.number + 6}`).value = dataQuey?.user?.email
      ? dataQuey?.user.email
      : "";

    const textInfo = worksheet.getCell(`C${TotalRow.number + 5}`);
    textInfo.value = "VAMOS Expeditions";
    textInfo.alignment = {
      vertical: "middle",
      horizontal: "right",
    };

    const infoUrl = worksheet.getCell(`C${TotalRow.number + 6}`);
    infoUrl.value = {
      text: "https://vamosexpeditions.com/",
      hyperlink: "https://vamosexpeditions.com/",
      tooltip: "Visit VAMOS Expeditions",
    };
    infoUrl.alignment = {
      vertical: "middle",
      horizontal: "right",
    };

    //! workbook.xlsx.writeFile("VersionQuotation.xlsx");
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }

  private applyBackgroundFill(
    worksheet: Exceljs.Worksheet,
    startRow: number,
    endRow: number,
    startCol: number,
    endCol: number,
    backgroundColor?: string,
    horizontal?:
      | "distributed"
      | "justify"
      | "center"
      | "left"
      | "right"
      | "fill"
      | "centerContinuous"
      | undefined,
    color?: string,
    size?: number
  ) {
    for (let row = startRow; row <= endRow; row++) {
      const excelRow = worksheet.getRow(row);

      for (let col = startCol; col <= endCol; col++) {
        const cell = excelRow.getCell(col);

        cell.alignment = horizontal
          ? { vertical: "middle", horizontal: horizontal }
          : {};

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: backgroundColor },
        };

        cell.font = color
          ? {
              color: { argb: color },
              bold: true,
              size: size ? size : 11,
            }
          : {};

        cell.border = {};
      }
    }
  }
}
