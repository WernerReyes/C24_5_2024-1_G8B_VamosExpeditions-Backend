import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "../sections/header.section";
import { footerSection } from "../sections/footer.section";

interface ReportOptions {
  title?: string;
  subTitle?: string;
  dataQuey: any;
}

export class HotelReportPDF {
  constructor() {}

  private formatDate(dateString: string, dayNumber: number): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return `Day ${dayNumber} (${formattedDate})`;
  }

  private generateTableContent(dataQuey: any) {
    const hotelRoomData = dataQuey[0]?.hotel_room_trip_details.map(
      (db: any, index: number) => {
        return [
          this.formatDate(db.date, index + 1),
          `${db.hotel_room.hotel.name}`,
          `${db.hotel_room.room_type}`,
          `$ ${db.hotel_room.rate_usd}`,
        ];
      }
    );

    

    const total = dataQuey?.map((trip:any) => {
      return trip.version_quotation.final_price
    })
    

    return [
      [
        { text: "Day", style: "tableHeader" },
        { text: "Accommodation", style: "tableHeader" },
        { text: "Room type", style: "tableHeader" },
        { text: "Price day", style: "tableHeader" },
      ],

      ...hotelRoomData,
      [
        "",
        "",
        "",
        {
          text: `Total: $ ${total ?? 0}`,
          colSpan: 1,
          style: "tableHeader",
        },
      ],
    ];
  }

  private getDocumentStyles(): any {
    return {
      tableReport: {
        fontSize: 13,
        color: "#425C77",
        bold: false,
        italics: true,
        alignment: "left",
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
        margin: [0, 0, 0, 10],
      },
    };
  }

  public generateReport(reportOptions: ReportOptions): TDocumentDefinitions {
    const { title, subTitle, dataQuey } = reportOptions;

    
    const User = dataQuey?.map((trip:any) => {
      return trip.version_quotation.user.fullname
    })
    
    return {
      pageOrientation: "portrait",
      header: headerSection({
        title: title ?? "Hotel Report",
        subTitle: subTitle ?? "Detailed Itinerary",
      }),
      pageSize: "A4",
      pageMargins: [20, 75, 20, 40],
      footer: (currentPage, pageCount, pageSize) =>
        footerSection(currentPage, pageCount, pageSize,User),
      content: [
        { text: "Quick Summary", style: "textHeader" },
        {
          layout: "reservationLayout",
          style: "tableReport",
          table: {
            headerRows: 1,
            widths: ["*", "auto", "*", "*"],
            body: this.generateTableContent(dataQuey),
          },
        },
      ],
      defaultStyle: {},
      styles: this.getDocumentStyles(),
    };
  }
}
