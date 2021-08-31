import type { BankStatement } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import dayjs from "dayjs";
import { get } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, convertToRp } from "__@root/utils";

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const { getAccount } = stores.getAccountContext();
  const processingData = (bankStatement: BankStatement) => {
    const account = get(getAccount(bankStatement.accountId))?.name || "-";
    return [
      { text: dayjs(bankStatement.date).format("DD-MM-YYYY"), style: "cell-date" },
      { text: account, style: "cell" },
      { text: bankStatement.description, style: "cell" },
      { text: convertToRp(bankStatement.in), style: "cell-number" },
      { text: convertToRp(bankStatement.out), style: "cell-number" },
      { text: convertToRp(bankStatement.balance), style: "cell-number" }
      // { text: bank.balance, style: "cell" }
    ];
  };
  return {
    pdf: (dataList: BankStatement[], metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(dataList.map(processingData));
      return pdfMake(doc).download(metadata.filename || `bank-${now.getTime()}.pdf`);
    },
    csv: (dataList: BankStatement[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(dataList.map(processingData), `bank-${now.getTime()}.csv`);
    },
    print: (dataList: BankStatement[], metadata: Metadata = {}) => {
      const doc = createPdfDef(dataList.map(processingData));
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
      text: "AKUN PERKIRAAN",
      style: "header"
    },
    {
      text: "DESKRIPSI",
      style: "header"
    },
    {
      text: "MASUK",
      style: "header"
    },
    {
      text: "KELUAR",
      style: "header"
    },
    {
      text: "SALDO",
      style: "header"
    }
  ];
  const docDefinition = {
    pageSize: "A4",
    pageOrientation: "landscape"
  };
  return {
    ...docDefinition,
    content: [
      {
        text: "Data Bank",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: [60, "auto", "*", "auto", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
