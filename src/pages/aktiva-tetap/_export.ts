import type { Inventory } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { dateCell, downloadCsv, numericCell, textCell } from "__@root/utils";

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const processingData = (inventory: Inventory, isCsv = false) => {
    const { getCategoryInventory } = stores.getInventoryContext();
    const category = getCategoryInventory(inventory.categoryId)?.name;
    const total = inventory.quantity * inventory.priceItem;
    return [
      dateCell(inventory.date, { isCsv }),
      textCell(inventory.name, { isCsv }),
      textCell(category, { isCsv }),
      numericCell(inventory.quantity, { isCsv }),
      numericCell(inventory.priceItem, { isCsv, type: "rp" }),
      numericCell(total, { isCsv, type: "rp" })
    ];
  };
  return {
    pdf: (dataList: Inventory[], metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList.map((_) => processingData(_)));
      return pdfMake(doc).download(metadata.filename || `aktiva-tetap-${now.getTime()}.pdf`);
    },
    csv: (dataList: Inventory[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(
        dataList.map((_) => processingData(_, true)),
        `aktiva-tetap-${now.getTime()}.csv`
      );
    },
    print: (dataList: Inventory[], metadata: Metadata = {}) => {
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
      text: "NAMA BARANG",
      style: "header"
    },
    {
      text: "KATEGORI",
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
        text: "Data Aktiva Tetap",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: ["auto", "*", "auto", "auto", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
