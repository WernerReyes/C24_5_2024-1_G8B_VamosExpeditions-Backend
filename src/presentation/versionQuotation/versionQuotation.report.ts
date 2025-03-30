import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import {
  HotelRoomTripDetails,
  TripDetails,
  VersionQuotation,
} from "@/domain/entities";
import { footerSection, headerSection } from "@/report";

interface ReportOptions {
  title?: string;
  subTitle?: string;
  dataQuey: VersionQuotation;
}

export class VersionQuotationReport {
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

    console.log("diffDays", diffDays);

    // **Step 1: Pre-fill all dates, even if empty**
    for (let i = 0; i < diffDays; i++) {
      const currentDate = new Date(trip_details!.start_date);
      currentDate.setDate(currentDate.getDate() + i); // Increment days

      const dayLabel = this.formatDateWithoutDay(currentDate);
      groupedData[dayLabel] = []; // Initialize empty array for each date
    }

    // console.log(groupedData);

    // **Step 2: Add hotel room details to correct date**
    trip_details?.hotel_room_trip_details?.forEach(
      (db: HotelRoomTripDetails) => {
        const dayLabel = this.formatDateWithoutDay(db.date);

        console.log("dayLabel", dayLabel);

        groupedData[dayLabel]?.push([
          { text: db?.hotel_room?.hotel?.name || "-", alignment: "left" },
          { text: db?.hotel_room?.room_type || "-", alignment: "left" },
          {
            text: db?.number_of_people?.toString() || "-",
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
      console.log("hotels", hotels[0], index);
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

  public generateReport(reportOptions: ReportOptions): TDocumentDefinitions {
    const { title, subTitle, dataQuey } = reportOptions;

    return {
      pageOrientation: "portrait",
      header: headerSection({
        title: title ?? "Hotel Report",
        subTitle: subTitle ?? "Detailed Itinerary",
      }),
      pageSize: "A4",
      pageMargins: [20, 75, 20, 40],
      footer: (currentPage, pageCount, pageSize) =>
        footerSection(currentPage, pageCount, pageSize, dataQuey.user),
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
    };
  }
}
