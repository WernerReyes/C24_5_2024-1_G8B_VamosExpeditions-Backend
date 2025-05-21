import type { IUserModel } from "@/infrastructure/models";
import path from "path";
import PdfPrinter from "pdfmake";
import type {
  BufferOptions,
  Content,
  StyleDictionary,
  TDocumentDefinitions,
} from "pdfmake/interfaces";
import stream from "stream";
import { footerSection, headerSection } from "./sections";
import { ContextPageSize } from 'pdfmake/interfaces';

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "./fonts/Roboto-Medium.ttf"),
    bold: path.join(__dirname, "./fonts/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "./fonts/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "./fonts/Roboto-MediumItalic.ttf"),
  },
};

interface ReportOptions {
  title: string;
  subTitle: string;
  content: Content;
  styles?: StyleDictionary;
  user: IUserModel;
}

export class PdfService {
  protected printer = new PdfPrinter(fonts);

  protected primaryColor = "#01A3BB";

  private generateTDocumentDefinitions(
    reportOptions: ReportOptions
  ): TDocumentDefinitions {
    const { title, subTitle, user, styles, content } = reportOptions;
    return {
      // pageOrientation: "portrait",
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
    options?: BufferOptions
  ): PDFKit.PDFDocument {
    return this.printer.createPdfKitDocument(
      this.generateTDocumentDefinitions(reportOptions),
      options
    );
  }

  protected async createPdfForEmail(
    reportOptions: ReportOptions,
    options?: BufferOptions
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

export type { Content, StyleDictionary, ContextPageSize };
