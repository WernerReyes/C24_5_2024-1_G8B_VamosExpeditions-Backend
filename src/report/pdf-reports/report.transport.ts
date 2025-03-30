import { TDocumentDefinitions } from "pdfmake/interfaces";

export const reportTransport = (): TDocumentDefinitions => {
  return {
    content: [
      {
        text: "Reporte de Transporte",
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
