import PdfPrinter from "pdfmake";
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import path from "path";
import stream from "stream";

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/Roboto-Medium.ttf"),
    bold: path.join(__dirname, "../fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/Roboto-MediumItalic.ttf"),
  },
};

const customTableLayouts: Record<string, CustomTableLayout> = {
  reservationLayout: {
    hLineWidth: function (i, node) {
      return 0.8;
    },
    vLineWidth: function (i) {
      return 0;
    },

    hLineColor: function (i) {
      return "#bbbbbb";
    } /*
    vLineColor: function (i) {
      
      return "#bbbbbb";
    }, */,
    paddingLeft: function (i) {
      return i === 0 ? 0 : 8;
    },
    paddingRight: function (i, node) {
      return node.table.widths && i === node.table.widths.length - 1 ? 0 : 8;
    },
    fillColor: function (i, node) {
      if (i === 0) {
        return "#01A3BB";
      }
      /*       if (i === node.table.body.length - 1) {
        return "gray";
      } */

      return i === 0 ? "#01A3BB" : i % 2 === 0 ? "#F4F6F6" : null;
    },
  },
};

export class PdfService {
  private printer = new PdfPrinter(fonts);

  public createPdf(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    }
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(docDefinition, options);
  }

  public async createPdfEmail(
    docDefinition: TDocumentDefinitions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    }
  ): Promise<Buffer> {
    // Crear el documento PDF
    const pdfDoc = this.printer.createPdfKitDocument(docDefinition, options);

    // Convertir el stream de PDF en un Buffer
    const chunks: Uint8Array[] = [];
    const bufferStream = new stream.PassThrough();

    pdfDoc.pipe(bufferStream);
    pdfDoc.end();

    // Acumular los datos del PDF en un Buffer
    return new Promise((resolve, reject) => {
      bufferStream.on("data", (chunk) => chunks.push(chunk));
      bufferStream.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(pdfBuffer);
      });
      bufferStream.on("error", (error) => reject(error));
    });
  }
}
