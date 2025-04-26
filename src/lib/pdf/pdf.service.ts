import { User } from "@/domain/entities";
import path from "path";
import PdfPrinter from "pdfmake";
import type {
  BufferOptions,
  Content,
  CustomTableLayout,
  StyleDictionary,
  TDocumentDefinitions
} from "pdfmake/interfaces";
import stream from "stream";
import { footerSection, headerSection } from "./sections";

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "./fonts/Roboto-Medium.ttf"),
    bold: path.join(__dirname, "./fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "./fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "./fonts/Roboto-MediumItalic.ttf"),
  },
};

const customTableLayouts: Record<string, CustomTableLayout> = {
  reservationLayout: {
    hLineWidth: function (i, node) {
      return 0.8;
    },
    vLineWidth: function (i, node) {
      return 0.8;
    },

    hLineColor: function (i) {
      return "#bbbbbb";
    },
    vLineColor: function (i) {
      return "#bbbbbb";
    },

    paddingRight: function (i, node) {
      return node.table.widths && i === node.table.widths.length - 1 ? 0 : 8;
    },
    fillColor: function (i, node) {
      if (i === 0) {
        return "#01A3BB";
      }

      if (i === node.table.body.length - 1) {
        return "white";
      }

      return i === 0 ? "#01A3BB" : i % 2 === 0 ? "#F4F6F6" : null;
    },
  },
};

interface ReportOptions {
  title: string;
  subTitle: string;
  content: Content;
  styles?: StyleDictionary;
  user: User;
}

export class PdfService {
  private printer = new PdfPrinter(fonts);

  private generateTDocumentDefinitions(
    reportOptions: ReportOptions
  ): TDocumentDefinitions {
    const { title, subTitle, user, styles, content } = reportOptions;
    return {
      pageOrientation: "portrait",
      header: headerSection({
        title: title,
        subTitle: subTitle,
      }),
      pageSize: "A4",
      pageMargins: [20, 75, 20, 40],
      footer: (currentPage, pageCount, pageSize) =>
        footerSection(currentPage, pageCount, pageSize, user),
      content,

      styles,
    };
  }

  protected createPdf(
    reportOptions: ReportOptions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    }
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(
      this.generateTDocumentDefinitions(reportOptions),
      options
    );
  }

  protected async createPdfForEmail(
    reportOptions: ReportOptions,
    options: BufferOptions = {
      tableLayouts: customTableLayouts,
    }
  ): Promise<Buffer> {
    const pdfDoc = this.printer.createPdfKitDocument(
      this.generateTDocumentDefinitions(reportOptions),
      options
    );

    const chunks: Uint8Array[] = [];
    const bufferStream = new stream.PassThrough();

    pdfDoc.pipe(bufferStream);
    pdfDoc.end();

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
