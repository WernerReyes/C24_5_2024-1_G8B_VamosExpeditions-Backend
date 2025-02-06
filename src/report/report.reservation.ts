import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { headerSection } from './sections/header.section';

interface ReportOptions {
  title?: string;
  subTitle?: string;
}

export const getTravelItineraryReport = (
  options: ReportOptions,
): TDocumentDefinitions => {
  const { title, subTitle } = options;

  // Datos del itinerario
  const itinerary = [
    { day: 1, date: 'Tue Sep 10, 2024', description: 'Arrival to Lima', accommodation: 'Second Home - Ocean View' },
    { day: 2, date: 'Wed Sep 11, 2024', description: 'Free day Lima', accommodation: 'Second Home - Ocean View' },
    { day: 3, date: 'Thu Sep 12, 2024', description: 'The best of Lima', accommodation: 'Second Home - Ocean View' },
    { day: 4, date: 'Fri Sep 13, 2024', description: 'Paracas National Reserve', accommodation: 'La Hacienda Paracas - Standard' },
    { day: 5, date: 'Sat Sep 14, 2024', description: 'Ballestas and Nasca Lines', accommodation: 'Mossone - Standard' },
    { day: 6, date: 'Sun Sep 15, 2024', description: 'Flight to the Andes', accommodation: 'Casa de Avila - Standard' },
    { day: 7, date: 'Mon Sep 16, 2024', description: 'The White city of Arequipa', accommodation: 'Casa de Avila - Standard' },
    { day: 8, date: 'Tue Sep 17, 2024', description: 'Towards the Colca Canyon', accommodation: 'Colca Lodge - Standard' },
    { day: 9, date: 'Wed Sep 18, 2024', description: "Condor's cross and to the Altiplano", accommodation: 'Jose Antonio Puno - Suite' },
    { day: 10, date: 'Thu Sep 19, 2024', description: 'Lake Titicaca', accommodation: 'Jose Antonio Puno - Suite' },
    { day: 11, date: 'Fri Sep 20, 2024', description: 'Luquina community', accommodation: 'Jose Antonio Puno - Suite' },
    { day: 12, date: 'Sat Sep 21, 2024', description: 'Scenery train to Cusco', accommodation: 'Casa San Blas - Standard' },
    { day: 13, date: 'Sun Sep 22, 2024', description: 'Free day Cusco', accommodation: 'Casa San Blas - Standard' },
    { day: 14, date: 'Mon Sep 23, 2024', description: 'Moray and Maras', accommodation: 'Mountain View - Mountain View' },
    { day: 15, date: 'Tue Sep 24, 2024', description: 'Ollantaytambo', accommodation: 'El Albergue - Superior Balcony' },
    { day: 16, date: 'Wed Sep 25, 2024', description: 'Short Inca Trail', accommodation: 'El Mapi - Superior' },
    { day: 17, date: 'Thu Sep 26, 2024', description: 'Machu Picchu', accommodation: 'El Albergue - Superior Balcony' },
    { day: 18, date: 'Fri Sep 27, 2024', description: 'Ollantaytambo', accommodation: 'El Albergue - Superior Balcony' },
    { day: 19, date: 'Sat Sep 28, 2024', description: 'The historic capital of the Inca Empire', accommodation: 'Casa San Blas - Standard' },
    { day: 20, date: 'Sun Sep 29, 2024', description: 'Free day Cusco', accommodation: 'Casa San Blas - Standard' },
    { day: 21, date: 'Mon Sep 30, 2024', description: 'Free day Cusco and back to Lima', accommodation: '' },
    { day: 22, date: 'Tue Oct 1, 2024', description: 'Departure', accommodation: '' },
  ];

  return {
    pageOrientation: 'portrait',
    header: headerSection({
      title: title ?? 'Travel Itinerary',
      subTitle: subTitle ?? 'Detailed Itinerary',
    }),
    pageMargins: [40, 100, 40, 0], // [arriba, derecha, abajo, izquierda]
    content: [
      {
        layout:"reservationLayout",
        table: {
          headerRows: 1,
          widths: [50, '*', '*', '*'],
          body: [
            // Encabezados
            [
              { text: 'Day', bold: true, color: 'white',  /* alignment: 'center' */ },
              { text: 'Date', bold: true, color: 'white',  /* alignment: 'center' */ },
              { text: 'Description', bold: true, color: 'white',  /* alignment: 'center' */ },
              { text: 'Accommodation', bold: true, color: 'white',  /* alignment: 'center' */ },
            ],
            // Filas del itinerario
            ...itinerary.map((entry) => [
              { text: entry.day.toString(), /* alignment: 'center' */ },
              { text: entry.date, /* alignment: 'center' */ },
              { text: entry.description, bold: true },
              { text: entry.accommodation || 'N/A', /* alignment: 'center' */ },
            ]),
          ],
        },
      },
    ],
  };
};
