import type { Transaction } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { get } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, convertToRp } from "__@root/utils";
import dayjs from "dayjs";

export type TransactionDefInput = Transaction & {
  parent: string;
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const { getAccount } = stores.getAccountContext();
  const processingData = (transaction: Transaction) => {
    const debitAccount = get(getAccount(transaction.accountId));
    return [
      [
        { text: transaction.id, style: "cell", colSpan: 2 },
        { text: dayjs(transaction.date).format("DD-MM-YYYY"), style: "cell", colSpan: 2 },
        { text: transaction.description, style: "cell", colSpan: 2 },
        { text: transaction.status, style: "cell", align: "center", colSpan: 2 }
      ],
      [
        {},
        { text: debitAccount.id, style: "cell" },
        { text: debitAccount.name, style: "cell" },
        { text: convertToRp(transaction.amount), style: "cell", align: "right", colSpan: 2 },
        {}
      ],
      ...transaction.creditAccounts.map((_) => {
        const creditAccount = get(getAccount(_.id));
        return [
          {},
          { text: creditAccount.id, style: "cell", colSpan: 2 },
          { text: creditAccount.name, style: "cell", colSpan: 2 },
          {},
          { text: convertToRp(_.amount), style: "cell", align: "right", colSpan: 2 }
        ];
      })
    ];
  };
  return {
    pdf: (transactions: Transaction[], metadata: Metadata = {}) => {
      const doc = createPdfDef(transactions.map(processingData));
      return pdfMake(doc).download(metadata.filename || "transaction.pdf");
    },
    csv: (transactions: Transaction[], metadata: Metadata = {}) => {
      downloadCsv(transactions.map(processingData), metadata.filename || "transaction.csv");
    },
    print: (transactions: Transaction[], metadata: Metadata = {}) => {
      const doc = createPdfDef(transactions.map(processingData));
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = []) {
  const headerDef = [
    {
      text: "NO",
      style: "header"
    },
    {
      text: "TANGGAL",
      style: "header"
    },
    {
      text: "DESKRIPSI",
      style: "header"
    },
    {
      text: "STATUS",
      style: "header"
    }
  ];
  return {
    content: [
      {
        text: "Transaksi",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: [10, 60, 10, 10, 30, 30, 50],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: {
      ...pdfStyles,
      detail: {}
    }
  };
}
