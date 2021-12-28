import type { StockReport } from "@deboxsoft/accounting-api";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, numericCell, textCell } from "__@root/utils";

export type Metadata = Record<string, string>;
type DataList = Record<
  string,
  {
    name: string;
    data: StockReport[];
  }
>;
export const createReportContext = () => {
  const processingData = ({ stockReport, index }: { stockReport: StockReport; index: number }, isCsv?: boolean) => {
    const total = stockReport.endStock * stockReport.price;
    const expenseAmount = stockReport.out * stockReport.price;
    return [
      textCell(`${index + 1}`, { isCsv, params: { alignment: "center" } }),
      textCell(stockReport.nameProduct, { isCsv }),
      textCell(stockReport.unit, { isCsv, params: { alignment: "center" } }),
      numericCell(stockReport.price, { isCsv, type: "rp" }),
      numericCell(stockReport.startStock, { isCsv, type: "number", params: { alignment: "center" } }),
      numericCell(stockReport.in, { isCsv, type: "number", params: { alignment: "center" } }),
      numericCell(stockReport.out, { isCsv, type: "number", params: { alignment: "center" } }),
      numericCell(stockReport.endStock, { isCsv, type: "number", params: { alignment: "center" } }),
      numericCell(total, { isCsv, type: "rp" }),
      numericCell(expenseAmount, { isCsv, type: "rp" })
    ];
  };
  function createPdfDef(dataList: DataList) {
    const content = [];
    let start = true;
    const keys = Object.keys(dataList);
    for (const key of keys) {
      const categoryName = dataList[key].name;
      const data = dataList[key].data.map((_, index) => processingData({ stockReport: _, index }));
      const pageBreak = (!start && "before") || undefined;
      const doc = _pdfByCategory(data, categoryName, pageBreak);
      content.push(doc);
      start = false;
    }
    return {
      pageOrientation: "landscape",
      content,
      styles: {
        ...pdfStyles,
        detail: {}
      }
    };
  }
  return {
    pdf: (dataList: DataList, metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList);
      return pdfMake(doc).download(metadata.filename || `stock-report-${now.getTime()}.pdf`);
    },
    csv: (dataList: StockReport[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(
        dataList.map((_, index) => processingData({ stockReport: _, index }, true)),
        `stock-${now.getTime()}.csv`
      );
    },
    print: (dataList: DataList, metadata: Metadata = {}) => {
      const doc = createPdfDef(dataList);
      return pdfMake(doc).print();
    }
  };
};

function _pdfByCategory(dataDef = [], categoryName: string, pageBreak = undefined) {
  const headerDef1 = [
    {
      text: "NO",
      style: "header",
      rowSpan: 2
    },
    {
      text: "NAMA BARANG",
      style: "header",
      rowSpan: 2
    },
    {
      text: "SATUAN",
      style: "header",
      rowSpan: 2
    },
    {
      text: "HARGA BARANG/PCS",
      style: "header",
      rowSpan: 2
    },
    {
      text: "SALDO AWAL",
      style: "header",
      rowSpan: 2
    },
    {
      text: "MUTASI",
      style: "header",
      colSpan: 2
    },
    {},
    {
      text: "STOCK AKHIR",
      style: "header",
      rowSpan: 2
    },
    {
      text: "TOTAL",
      style: "header",
      rowSpan: 2
    },
    {
      text: "BIAYA PARCET",
      style: "header",
      rowSpan: 2
    }
  ];
  const headerDef2 = [
    {},
    {},
    {},
    {},
    {},
    {
      text: "MASUK",
      style: "header"
    },
    {
      text: "KELUAR",
      style: "header"
    },
    {},
    {},
    {}
  ];
  return [
    {
      pageBreak,
      text: `PERSEDIAAN ${categoryName.toUpperCase()}`,
      style: "title"
    },
    {
      style: "cell",
      table: {
        headerRows: 2,
        widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto", "auto", "auto"],
        body: [headerDef1, headerDef2, ...dataDef]
      }
    }
  ];
}
