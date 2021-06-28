import { createPdf } from "pdfmake/build/pdfmake";

const fonts = {
  Roboto: {
    normal: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf"
  }
};

export const pdfStyles = {
  title: {},
  header: {
    fontSize: 12,
    bold: true
  },
  cell: {
    fontSize: 10
  }
};

export const pdfMake = (definition) => createPdf(definition, null, fonts);
