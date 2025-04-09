import { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "../sections/header.section";
import { footerSection } from "../sections/footer.section";
import { HotelRoomTripDetails, TripDetails } from "@/domain/entities";

interface ReportOptions {
  title?: string;
  subTitle?: string;
  dataQuey: any;
}

export class HotelReportPDF {
  constructor() {}

  private formatDateWithoutDay(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }

  private generateTableContent(dataQuey: TripDetails[]) {
    // Group hotels by date
    const groupedData: Record<string, any[]> = {};

    dataQuey.forEach((trip: TripDetails) => {
      trip.hotel_room_trip_details?.forEach((db: HotelRoomTripDetails, index: number) => {
        const dayLabel = this.formatDateWithoutDay(db.date as any as string); // Group by formatted date
        if (!groupedData[dayLabel]) {
          groupedData[dayLabel] = [];
        }
        groupedData[dayLabel].push([
          { text: db.hotel_room?.hotel?.name || "-", alignment: "left" },
          { text: db.hotel_room?.room_type || "-", alignment: "left" },
          { text: db.cost_person?.toString() || "-", alignment: "center" },
          { text: db.hotel_room?.rate_usd ? `$ ${db.hotel_room.rate_usd.toFixed(2)}` : "-", alignment: "center" },
        ]);
      });
    });

  
    // Construct table body with merged date cells
    const tableBody: any[] = [
      [
        { text: "Day", style: "tableHeader", bold: true,  margin: [5, 5, 5, 5] },
        { text: "Accommodation", style: "tableHeader", bold: true, margin: [5, 5, 5, 5] },
        { text: "Room type", style: "tableHeader", bold: true, margin: [5, 5, 5, 5] },
        { text: "People", style: "tableHeader", bold: true, margin: [5, 5, 5, 5] },
        { text: "Price day", style: "tableHeader", bold: true, margin: [5, 5, 5, 5] },
      ],
    ];

    const total = dataQuey?.map((trip:any) => {
      return trip.version_quotation.final_price
    })

    Object.entries(groupedData).forEach(([dayLabel, hotels], index) => {
      // Add first row with merged day cell
      tableBody.push([
        {
          text: `Day ${index + 1} (${dayLabel})`,
          rowSpan: hotels.length,
          alignment: "center",
          margin: [2, 2, 2, 2],
        },
        ...hotels[0], // First hotel's data
      ]);

      // Add remaining hotels without date column
      for (let i = 1; i < hotels.length; i++) {
        tableBody.push([{ text: "", alignment: "center", border: [false, false, false, false] }, ...hotels[i]]);
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
        margin: [5, 5, 5, 5]
      },
      {},
      {}, // Empty column (spanned)
      {},
      {
        text: `$ ${total}`,
        alignment: "center",
        style: "tableHeader",
        bold: true,
        margin: [5, 5, 5, 5]
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

    const User = dataQuey?.map((trip: any) => {
      return trip.version_quotation.user.fullname;
    });

    // this.generateTableContent(dataQuey)

    return {
      pageOrientation: "portrait",
      header: headerSection({
        title: title ?? "Hotel Report",
        subTitle: subTitle ?? "Detailed Itinerary",
      }),
      pageSize: "A4",
      pageMargins: [20, 75, 20, 40],
      footer: (currentPage, pageCount, pageSize) =>
        footerSection(currentPage, pageCount, pageSize, User),
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
