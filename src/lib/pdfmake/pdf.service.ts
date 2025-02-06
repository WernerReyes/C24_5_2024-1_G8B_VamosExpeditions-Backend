import PdfPrinter from "pdfmake";
import {
  BufferOptions,
  CustomTableLayout,
  TDocumentDefinitions,
} from "pdfmake/interfaces";

import path from "path";

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
/*       if (i === 0 || i === node.table.body.length) {
        return 0.5;
      }
      return i === node.table.headerRows ? 2 : 1; */
      return 0.5;
    },
    vLineWidth: function (i) {
      return 0.5;
    },
   
    hLineColor: function (i) {
      /* return i === 1 ? null : "#bbbbbb"; */
      return "#bbbbbb";
    },
    vLineColor: function (i) {
      /* return i === 0 ? "black" : "#bbbbbb"; */
      return "#bbbbbb";
    },
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
      if (i === node.table.body.length - 1) {
        return "gray";
      }

      return i  === 0 ? '#01A3BB' : i % 2 === 0 ? '#F4F6F6' : null
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
}
