import type { IUserModel } from "@/infrastructure/models";
import type { Content, ContextPageSize } from "@/infrastructure/pdf/pdf.service";

export const footerSection = (
  currentPage: number,
  pageCount: number,
  pageSize: ContextPageSize,
  user: IUserModel
): Content => {
  return {
    layout: "noBorders",
    
    table: {
      widths: ["*", "*"],
      body: [
        [
          {
            text: "",
            margin: [20, 0, 0, 0],
            stack: [
              {
                text: `Realizado por:`,
                alignment: "left",
                style: "footerText",
              },
              {
                text: `${user.fullname}`,
                alignment: "left",
                style: "footerText",
                margin: [5, 0, 0, 0],
              },
              {
                text: `${user.email}`,
                alignment: "left",
                style: "footerText",
                margin: [5, 0, 0, 0],
              },
            ],
          },
          {
            text: "",
            margin: [0, 0, 20, 0],
            stack: [
              {
                text: `Page ${currentPage} of ${pageCount}`,
                alignment: "right",
                style: "footerText",
              },
              {
                text: "Vamos Expeditions",
                alignment: "right",
                style: "footerText",
              },
              {
                text: "https://vamosexpeditions.com/",
                link: "https://vamosexpeditions.com/",
                alignment: "right",
                style: "footerText",
              },
            ],
          },
        ],
      ],
    },

    style: {
      fillColor: "#01A3BB",
      fontSize: 10,
      color: "white",
      italics: true,
    },
  };
};
