import { createPdf } from "pdfmake/build/pdfmake";
import vfsFonts from "./vfs_fonts";

const fonts = {
  Roboto: {
    normal: "Roboto-Regular.ttf",
    bold: "Roboto-Medium.ttf",
    italics: "Roboto-Italic.ttf",
    bolditalics: "Roboto-MediumItalic.ttf"
  }
};

export const pdfStyles = {
  title: {
    alignment: "center",
    bold: true,
    fontSize: 12
  },
  header: {
    fontSize: 9,
    bold: true,
    alignment: "center"
  },
  cell: {
    fontSize: 8
  },
  "cell-date": {
    alignment: "center"
  },
  "cell-number": {
    alignment: "right"
  }
};

export const pdfMake = (definition) => createPdf(definition, null, fonts, vfsFonts);
