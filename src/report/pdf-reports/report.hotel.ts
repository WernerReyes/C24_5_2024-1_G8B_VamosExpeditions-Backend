import { TDocumentDefinitions } from "pdfmake/interfaces";

export const reportHotel = (): TDocumentDefinitions => {
  return {
    content: [
      {
        text: "Reporte de Hoteles",
        style: "header",
      },
      {
        text: "Hoteles",
        style: "subheader",
      },
      {
        style: "tableExample",
        table: {
          body: [
            ["Nombre", "Dirección", "Teléfono", "Email"],
            ["Hotel 1", "Dirección 1", "123456789", ""],
          ],
        },
      },
    ],
  };
};
