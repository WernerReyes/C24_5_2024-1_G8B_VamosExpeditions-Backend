import type { HotelRoomTripDetails, VersionQuotation } from "@/domain/entities";
import type { StyleDictionary } from "pdfmake/interfaces";
import { PdfService } from "@/lib";
import { DateAdapter } from "@/core/adapters";

interface ReportOptions {
  title?: string;
  subTitle?: string;
  dataQuey: VersionQuotation;
}

export class VersionQuotationReport extends PdfService {
  constructor() {
    super();
  }

  private generateTableContent({
    trip_details,
    final_price,
  }: VersionQuotation) {
    // Group hotels by date
    const groupedData: Record<string, any[]> = {};

    const diffDays =
      trip_details?.start_date && trip_details?.end_date
        ? Math.abs(
            (new Date(trip_details.start_date).getTime() -
              new Date(trip_details.end_date).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        : 0;

    // **Step 1: Pre-fill all dates, even if empty**
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(trip_details!.start_date);
      currentDate.setDate(currentDate.getDate() + i); // Increment days

      const dayLabel = DateAdapter.format(currentDate, "EEE, MMM dd, yyyy");
      groupedData[dayLabel] = []; // Initialize empty array for each date
    }

    // **Step 2: Add hotel room details to correct date**
    trip_details?.hotel_room_trip_details?.forEach(
      (db: HotelRoomTripDetails) => {
        const dayLabel = DateAdapter.format(db.date, "EEE, MMM dd, yyyy"); // Format date to match the label

        groupedData[dayLabel]?.push([
          { text: db?.hotel_room?.hotel?.name || "-", alignment: "left" },
          { text: db?.hotel_room?.room_type || "-", alignment: "left" },
          {
            text: db?.cost_person?.toString() || "-",
            alignment: "center",
          },
          {
            text: db?.hotel_room?.rate_usd
              ? `$ ${db.hotel_room.rate_usd.toFixed(2)}`
              : "-",
            alignment: "center",
          },
        ]);
      }
    );

    // Step 3: Fill empty days with placeholders
    Object.keys(groupedData).forEach((dayLabel) => {
      if (groupedData[dayLabel].length === 0) {
        groupedData[dayLabel].push([
          { text: "-", alignment: "left" },
          { text: "-", alignment: "left" },
          { text: "-", alignment: "center" },
          { text: "-", alignment: "center" },
        ]);
      }
    });

    // Construct table body with merged date cells
    const tableBody: any[] = [
      [
        { text: "Day", style: "tableHeader", bold: true, margin: [5, 5, 5, 5] },
        {
          text: "Accommodation",
          style: "tableHeader",
          bold: true,
          margin: [5, 5, 5, 5],
        },
        {
          text: "Room type",
          style: "tableHeader",
          bold: true,
          margin: [5, 5, 5, 5],
        },
        {
          text: "People",
          style: "tableHeader",
          bold: true,
          margin: [5, 5, 5, 5],
        },
        {
          text: "Price day",
          style: "tableHeader",
          bold: true,
          margin: [5, 5, 5, 5],
        },
      ],
    ];

    Object.entries(groupedData).forEach(([dayLabel, hotels], index) => {
      tableBody.push([
        {
          text: `Day ${index + 1} (${dayLabel})`,
          rowSpan: hotels.length,
          alignment: "center",
          margin: [2, 2, 2, 2],
        },
        ...(hotels ? hotels[0] : []), // First hotel's data
      ]);

      // Add remaining hotels without date column
      for (let i = 1; i < hotels.length; i++) {
        tableBody.push([
          {
            text: "",
            alignment: "center",
            border: [false, false, false, false],
          },
          ...(hotels ? hotels[i] : []), // First hotel's data
        ]);
      }
    });

    //* Add TOTAL row at the end, spanning across 3 columns
    tableBody.push([
      {
        text: "TOTAL",
        colSpan: 4,
        alignment: "right",
        style: "tableHeader",
        bold: true,
        margin: [5, 5, 5, 5],
      },
      {},
      {}, // Empty column (spanned)
      {},
      {
        text: `$ ${final_price}`,
        alignment: "center",
        style: "tableHeader",
        bold: true,
        margin: [5, 5, 5, 5],
      },
    ]);

    return tableBody;
  }

  private getDocumentStyles(): StyleDictionary {
    return {
      tableReport: {
        fontSize: 13,
        color: "#425C77",
        bold: false,
        italics: true,
        alignment: "center",
        margin: [0, 0, 0, 0],
        sub: true,
      },
      tableHeader: {
        fontSize: 14,
        color: "white",
        bold: true,
        italics: true,
        fillColor: "#01A3BB",
      },

      textHeader: {
        fontSize: 20,
        color: "#01A3BB",
        bold: true,
        alignment: "left",
        margin: [0, 0, 0, 0],
      },
    };
  }

  private reportOptions(reportOptions: ReportOptions) {
    const { title, subTitle, dataQuey } = reportOptions;

    return {
      title: title ?? "Hotel Report",
      subTitle: subTitle ?? "Detailed Itinerary",
      content: [
        { text: "Quick Summary", style: "textHeader" },
        {
          layout: "reservationLayout",
          style: "tableReport",
          table: {
            headerRows: 1,

            widths: ["auto", "*", "auto", "auto", "auto"],
            body: this.generateTableContent(dataQuey),
          },
        },
      ],
      styles: this.getDocumentStyles(),
      user: dataQuey.user!,
    };
  }

  public generateReport(reportOptions: ReportOptions) {
    return this.createPdf(this.reportOptions(reportOptions));
  }

  public generateReportForEmail(reportOptions: ReportOptions) {
    return this.createPdfForEmail(this.reportOptions(reportOptions));
  }
}
