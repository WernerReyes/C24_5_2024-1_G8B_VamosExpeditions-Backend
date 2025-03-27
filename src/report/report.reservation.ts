import { TDocumentDefinitions } from "pdfmake/interfaces";
import { headerSection } from "./sections/header.section";
import { footerSection } from "./sections/footer.section";

interface ReportOptions {
  title?: string;
  subTitle?: string;
  data: any;
}

export const getTravelItineraryReport = (
  options: ReportOptions
): TDocumentDefinitions => {
  const { title, subTitle, data } = options;

  const formatDate = (dateString: string, dayNumber: number): string => {
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
  };

  // Procesar las habitaciones del itinerario
  const hotelRoomData =
    data[0]?.version_quotation?.hotel_room_quotation.map(
      (room: any, index: number) => [
        (index + 1).toString(), // Número de fila
        formatDate(room.date, index + 1), // Fecha formateada
        room.hotel_room.hotel.name, // Nombre del hotel
      ]
    ) || [];

    const user= "Annelies Hamerlinck";
  return {
    pageOrientation: "portrait",
    header: headerSection({
      title: title ?? "Travel Itinerary",
      subTitle: subTitle ?? "Detailed Itinerary",
    }),
    pageSize: "A4",
    pageMargins: [20, 75, 20, 40], // Margen inferior aumentado
    footer: (currentPage, pageCount, pageSize) =>
      footerSection(currentPage, pageCount, pageSize, user), // Llamada correcta al footer
    content: [
      { text: "Quick Summary", style: "textHeader" },
      {
        layout: "reservationLayout",
        style: "tableReport",
        table: {
          headerRows: 2,
          widths: ["*", "*", "*"],
          body: [
            // Encabezados
            [
              { text: "Day", style: "tableHeader" },
              { text: "Day", style: "tableHeader" },
              { text: "Accommodation", style: "tableHeader" },
            ],
            ...hotelRoomData,
          ],
        },
      },
    ],
    defaultStyle: {},
    styles: {
      tableReport: {
        fontSize: 13,
        color: "#425C77",
        bold: false,
        italics: true,
        alignment: "left",
        sub:true
      },
      tableHeader: {
        fontSize: 14,
        color: "white",
        bold: true,
        italics: true,
        fillColor: "#01A3BB", // Fondo para el encabezado de la tabla
      },
      textHeader: {
        fontSize: 20,
        color: "#01A3BB",
        bold: true,
        alignment: "left",
        margin: [0, 0, 0, 10],
      },
      
    },
  };
};