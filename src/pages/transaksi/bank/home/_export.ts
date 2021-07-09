import type { Bank } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { get } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv } from "__@root/utils";

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const { getAccount } = stores.getAccountContext();
  const processingData = (bank: Bank) => {
    const account = get(getAccount(bank.accountId)).name || "-";
    return [
      { text: bank.name, style: "cell" },
      { text: bank.noAccountBank, style: "cell" },
      { text: bank.nameAccountBank, style: "cell" },
      { text: account, style: "cell" }
      // { text: bank.balance, style: "cell" }
    ];
  };
  return {
    pdf: (dataList: Bank[], metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList.map(processingData));
      return pdfMake(doc).download(metadata.filename || `bank-${now.getTime()}.pdf`);
    },
    csv: (dataList: Bank[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(dataList.map(processingData), `bank-${now.getTime()}.csv`);
    },
    print: (dataList: Bank[], metadata: Metadata = {}) => {
      const doc = createPdfDef(dataList.map(processingData));
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = []) {
  const headerDef = [
    {
      text: "NAMA",
      style: "header"
    },
    {
      text: "NO REKENING",
      style: "header"
    },
    {
      text: "NAMA REKENING",
      style: "header"
    },
    {
      text: "AKUN PERKIRAAN",
      style: "header"
    }
  ];
  return {
    content: [
      {
        text: "Data Bank",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
