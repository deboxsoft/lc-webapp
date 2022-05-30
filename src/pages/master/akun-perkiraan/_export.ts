import type { Account } from "@deboxsoft/accounting-api";
import { stores } from "@deboxsoft/accounting-client";
import { get } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, getAccountType } from "__@root/utils";

export type AccountDefInput = Account & {
  parent: string;
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const { getAccount, getAccountsTree, accountStore } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  const processingData = (account: Account, preference) => {
    let parent = "-";
    if (account.parentId) {
      parent = get(getAccount(account.parentId)).name || parent;
    }
    return [
      { text: account.id, style: "cell" },
      { text: account.name, style: "cell" },
      { text: parent, style: "cell" },
      { text: getAccountType(account, preference), style: "cell" }
    ];
  };
  return {
    pdf: (progressCB, metadata: Metadata = {}) => {
      const preference = get(preferenceStore);
      const accounts = get(accountStore);
      const now = new Date();
      const doc = createPdfDef(accounts.map((account) => processingData(account, preference)));
      return pdfMake(doc).download(metadata.filename || `account-${now.getTime()}.pdf`, null, {
        progressCallback: progressCB
      });
    },
    csv: (metadata: Metadata = {}) => {
      const preference = get(preferenceStore);
      const accounts = get(getAccountsTree());
      const now = new Date();
      downloadCsv(
        accounts.reduce((result, account) => {
          const output = [account.id, "", account.name, getAccountType(account, preference)];
          result.push(output);

          // children
          if (Array.isArray(account.children)) {
            account.children.forEach((child) => {
              const _output = [child.id, child.parentId, child.name, getAccountType(child, preference)];
              result.push(_output);
            });
          }
          return result;
        }, []),
        `account-${now.getTime()}.csv`
      );
    },
    print: (metadata: Metadata = {}) => {
      const preference = get(preferenceStore);
      const accounts = get(accountStore);
      const doc = createPdfDef(accounts.map((account) => processingData(account, preference)));
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
