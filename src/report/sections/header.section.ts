/* import { DateFormatter } from "@/core/utils"; */

import { Content } from "pdfmake/interfaces";

const logo: Content = {
  image: "public/images/logo.png",
  alignment: "center",
  /* margin: [0, 15, 20, 0], */
  fit: [220, 200],
};

const currentDate: Content =   {
  text: "",/* DateFormatter.getDDMMMMYYYY(new Date()), */
  alignment: "right",
  /* margin: [60, 30], */
};

/* const currentDate: Content = {
  margin: [80, 0, 0, 0],
  layout: "noBorders",

  table: {
    body: [
      [
        {
          layout: "noBorders",
          width: "auto",
          table: {
            body: [
              [
                { text: "Fecha " },
                { text: DateFormatter.getDDMMMMYYYY(new Date()), bold: true },
              ],
            ],
          },
        },
      ],
    ],
  },
}; */

interface HeaderOptions {
  title?: string;
  subTitle?: string;
  showLogo?: boolean;
  showDate?: boolean;
}

export const headerSection = (options: HeaderOptions): Content => {
  const { title, subTitle, showLogo = true, showDate = true } = options;

  const headerLogo: Content = showLogo ? logo : { text: "" };
  const headerDate: Content = showDate ? currentDate : { text: "" };

  const headerSubTitle: Content = subTitle
    ? {
        text: subTitle,
        alignment: "center",
        /* margin: [0, 2, 0, 0], */
      }
    : { text: "" };

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            alignment: "center",
            /* margin: [0, 15, 0, 0], */
            style: "title", // Usar estilo global
          },
          headerSubTitle,
        ],
      }
    : { text: "" }; // Evitar null

  return {
    /* margin: [0, 15, 0, 0], */
    margin: [0, 20, 0, 0],
    columns: [headerLogo, headerTitle, headerDate],
  };
};
