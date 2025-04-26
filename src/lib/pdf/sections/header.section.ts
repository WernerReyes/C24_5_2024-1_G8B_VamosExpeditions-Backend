import { Content } from "pdfmake/interfaces";

const logo: Content = {
  image: "public/images/logo_1.png",
  /* cover: {
    width: 65,
    height: 65,
  }, */
  fit: [65, 65],
};

const currentDate: Content = {
  stack: [
    {
      text: "+51987524304",
    },
    {
      text: "https://vamosexpeditions.com/",
      link: "https://vamosexpeditions.com/",
    },
  ],
  style: {
    bold: false,
    color: "white",
    italics: true,
  },
  alignment: "right",
};

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
      }
    : { text: "" };

  const headerTitle: Content = title
    ? {
        stack: [
          {
            text: title,
            alignment: "center",
            style: "title",
          },
          headerSubTitle,
        ],
      }
    : { text: "" };

  return {
    table: {
      widths: ["*", "*", "*"],
      body: [
        [
          { margin: [20, -10, 20, 0], stack: [headerLogo] },
          { margin: [20, 10, 20, 0], stack: [headerTitle] },
          { margin: [20, 10, 20, 0], stack: [headerDate] },
        ],
        // Línea horizontal
        
      ],
    },
    style: {
      fillColor: "#01A3BB",
      fontSize: 10,
    },
    layout: {
      defaultBorder: false,
     
    },
  };
};
