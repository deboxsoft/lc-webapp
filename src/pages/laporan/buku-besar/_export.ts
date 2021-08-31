import type { Account } from "@deboxsoft/accounting-api";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, emptyCell, numericCell as balanceCell, textCell as nameCell } from "__@root/utils";
import { calculateBalance } from "./_utils";
const options = {
  formatDate: "DD MMMM YYYY",
  paddingChild: 0,
  paddingParent: 10,
  backgroundColorParent: "#eeeeee",
  backgroundColorSubtotal: "#cccccc",
  backgroundColorTotal: "#999999"
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const processingAccounts = (accounts: Account[], isCsv = false, metadata: Metadata) => {
    const _parseAccount = (account: Account) => {
      const balance = account.balance;
      const paramsParent = {
        fillColor: options.backgroundColorParent
      };
      const defParent = [
        nameCell(account.name, { isCsv, params: { ...paramsParent, margin: [options.paddingParent, 0, 0, 0] } }),
        emptyCell({ isCsv, params: paramsParent }),
        balanceCell(balance, { isCsv, params: paramsParent, type: "rp" })
      ];
      const defChild = [];
      if (account.children) {
        const paramsChildren = {};
        for (const child of account.children) {
          const balance = child.balance;
          defChild.push([
            nameCell(child.name, { isCsv, params: { ...paramsChildren, margin: [options.paddingChild, 0, 0, 0] } }),
            balanceCell(balance, { isCsv, params: paramsChildren, type: "rp" }),
            emptyCell({ isCsv, params: paramsChildren })
          ]);
        }
      }
      return [...defChild, defParent];
    };
    return accounts.reduce((_temp, _account) => {
      const _resultParse = _parseAccount(_account);
      _temp.push(..._resultParse);
      return _temp;
    }, []);
  };
  return {
    pdf: (accounts, progressCB, metadata: Metadata = {}) => {
      calculateBalance(accounts);
      const now = new Date();
      const doc = createPdfDef(processingAccounts(accounts, false, metadata), metadata);
      return pdfMake(doc).download(metadata.filename || `buku-besar-${now.getTime()}.pdf`, null, {
        progressCallback: progressCB
      });
    },
    csv: (accounts, metadata: Metadata = {}) => {
      calculateBalance(accounts);
      const now = new Date();
      downloadCsv(processingAccounts(accounts, true, metadata), `buku-besar-${now.getTime()}.csv`);
    },
    print: (accounts, metadata: Metadata = {}) => {
      calculateBalance(accounts);
      const doc = createPdfDef(processingAccounts(accounts, false, metadata), metadata);
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = [], { isBalanceFixed }: Metadata) {
  const headerDef = [
    {
      text: "AKUN PERKIRAAN",
      alignment: "center",
      style: "header"
    },
    {
      text: "SALDO",
      alignment: "center",
      colSpan: 2,
      style: "header"
    },
    {}
  ];
  return {
    content: [
      {
        text: `BUKU BESAR: ${isBalanceFixed ? "SALDO FIXED" : "SALDO PERKIRAAN"}`,
        style: "title",
        alignment: "center"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: ["*", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
