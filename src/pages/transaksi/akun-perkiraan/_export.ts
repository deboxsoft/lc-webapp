import type { Account } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { get } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv } from "__@root/utils";

export type AccountDefInput = Account & {
  parent: string;
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const { getAccount, getAccountType } = stores.getAccountContext();
  const processingData = (account: Account) => {
    let parent = "-";
    if (account.parentId) {
      parent = get(getAccount(account.parentId)).name || parent;
    }
    const type = get(getAccountType(account)).label || "-";
    return [
      { text: account.id, style: "cell" },
      { text: account.name, style: "cell" },
      { text: parent, style: "cell" },
      { text: type, style: "cell" }
    ];
  };
  return {
    pdf: (accounts: Account[], metadata: Metadata = {}) => {
      const doc = createPdfDef(accounts.map(processingData));
      return pdfMake(doc).download(metadata.filename || "account.pdf");
    },
    csv: (accounts: Account[], metadata: Metadata = {}) => {
      downloadCsv(accounts.map(processingData), "account.csv");
    },
    print: (accounts: Account[], metadata: Metadata = {}) => {
      const doc = createPdfDef(accounts.map(processingData));
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = []) {
  const headerDef = [
    {
      text: "KODE",
      style: "header"
    },
    {
      text: "NAMA",
      style: "header"
    },
    {
      text: "INDUK",
      style: "header"
    },
    {
      text: "KLASIFIKASI",
      style: "header"
    }
  ];
  return {
    content: [
      {
        text: "Data Akun Perkiraan",
        style: "title"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: [50, "*", "*", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
