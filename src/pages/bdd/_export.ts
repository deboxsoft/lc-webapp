import type { Bdd } from "@deboxsoft/accounting-api";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, numericCell, textCell, dateCell } from "__@root/utils";

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const processingData = (bdd: Bdd, isCsv?: boolean) => {
    return [
      dateCell(bdd.date, { isCsv }),
      dateCell(bdd.dateStart, { isCsv }),
      dateCell(bdd.dateEnd, { isCsv }),
      textCell(bdd.description, { isCsv }),
      numericCell(bdd.taxRate, { isCsv }),
      numericCell(bdd.amount, { isCsv, type: "rp" })
    ];
  };
  return {
    pdf: (dataList: Bdd[], metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList.map((_) => processingData(_)));
      return pdfMake(doc).download(metadata.filename || `bdd-${now.getTime()}.pdf`);
    },
    csv: (dataList: Bdd[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(
        dataList.map((_) => processingData(_, true)),
        `bdd-${now.getTime()}.csv`
      );
    },
    print: (dataList: Bdd[], metadata: Metadata = {}) => {
      const doc = createPdfDef(dataList.map((_) => processingData(_)));
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = []) {
  const headerDef = [
    {
      text: "TANGGAL",
      style: "header"
    },
    {
      text: "TANGGAL AWAL",
      style: "header"
    },
    {
      text: "TANGGAL AKHIR",
      style: "header"
    },
    {
      text: "DESKRIPSI",
      style: "header"
    },
    {
      text: "PAJAK (%)",
      style: "header"
    },
    {
      text: "NOMINAL",
      style: "header"
    }
  ];
  return {
    content: [
      {
        text: "Data BDD",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "auto", "*", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
