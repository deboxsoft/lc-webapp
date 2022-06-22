import type { Stock } from "@deboxsoft/accounting-api";
import type { StockContext } from "@deboxsoft/accounting-client/types/stores";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, numericCell, textCell } from "__@root/utils";

export type Metadata = Record<string, string>;
export const createReportContext = ({ productContext }: StockContext) => {
  const { getProduct } = productContext;
  const processingData = (stock: Stock, isCsv?: boolean) => {
    const total = stock.quantity * stock.price;
    return [
      textCell(getProduct(stock.productId).name, { isCsv }),
      numericCell(stock.quantity, { isCsv }),
      numericCell(stock.price, { isCsv, type: "rp" }),
      numericCell(total, { isCsv, type: "rp" })
    ];
  };
  return {
    pdf: (dataList: Stock[], metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList.map((_) => processingData(_)));
      return pdfMake(doc).download(metadata.filename || `stock-${now.getTime()}.pdf`);
    },
    csv: (dataList: Stock[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(
        dataList.map((_) => processingData(_, true)),
        `stock-${now.getTime()}.csv`
      );
    },
    print: (dataList: Stock[], metadata: Metadata = {}) => {
      const doc = createPdfDef(dataList.map((_) => processingData(_)));
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = []) {
  const headerDef = [
    {
      text: "NAMA BARANG",
      style: "header"
    },
    {
      text: "JUMLAH",
      style: "header"
    },
    {
      text: "HARGA SATUAN",
      style: "header"
    },
    {
      text: "TOTAL",
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
          widths: ["*", "auto", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
