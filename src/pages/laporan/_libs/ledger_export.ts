import type { BalanceSheetReport } from "@deboxsoft/accounting-api";
import type { AccountBalance } from "@deboxsoft/accounting-api";
import type { Writable } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, emptyCell, numericCell as balanceCell, textCell as nameCell } from "__@root/utils";

type GenerateReportOptions = {
  isCsv: boolean;
  paramsSubtotal: Record<string, any>;
  paramsTotal: Record<string, any>;
};
export interface CreateReportOptions {
  formatDate?: string;
  paddingChild?: number;
  paddingParent?: number;
  backgroundColorParent?: string;
  backgroundColorSubtotal?: string;
  backgroundColorTotal?: string;
  close: () => void;
  generateReport: (opts: GenerateReportOptions) => any;
  title: string;
  loading: Writable<boolean>;
  accountsBalance: BalanceSheetReport["accountsBalance"];
}

export interface ReportOptions {
  accountsBalance: BalanceSheetReport["accountsBalance"];
  date?: Date;
  filename?: string;
}

const options = {
  formatDate: "DD MMMM YYYY",
  paddingChild: 0,
  paddingParent: 10,
  backgroundColorParent: "#eeeeee",
  backgroundColorSubtotal: "#cccccc",
  backgroundColorTotal: "#999999"
};

export type Metadata = {
  title?: CreateReportOptions["title"];
};
export const createReportContext = (opts: CreateReportOptions) => {
  return {
    pdf: ({ accountsBalance, date = new Date(), filename }: ReportOptions) => {
      opts.loading.set(true);
      const now = new Date();
      const doc = createPdfDef(parsingAccountsBalance(accountsBalance), { title: opts.title });
      pdfMake(doc).download(filename || `${opts.title}-${now.getTime()}.pdf`, null, {
        progressCallback: (p) => {
          if (p === 1) {
            opts.loading.set(false);
          }
        }
      });
      opts.loading.set(false);
      opts.close && opts.close();
    },
    csv: ({ accountsBalance, date = new Date(), filename }: ReportOptions) => {
      opts.loading.set(true);
      const now = new Date();
      downloadCsv(
        parsingAccountsBalance(accountsBalance, { isCsv: true }),
        filename || `${opts.title}-${now.getTime()}.csv`
      );
      opts.close && opts.close();
    },
    print: ({ accountsBalance, date = new Date(), filename }: ReportOptions) => {
      opts.loading.set(true);
      const doc = createPdfDef(parsingAccountsBalance(accountsBalance), { title: opts.title });
      pdfMake(doc).print();
      opts.loading.set(false);
      opts.close && opts.close();
    }
  };
};

function parsingAccountsBalance(
  accountBalances: AccountBalance[],
  { isCsv = false }: Pick<GenerateReportOptions, "isCsv"> = { isCsv: false }
) {
  const _parseAccount = (accountBalance: AccountBalance) => {
    const balance = accountBalance.balance;
    const paramsParent = {
      fillColor: options.backgroundColorParent
    };
    const defParent = [
      nameCell(accountBalance.name, { isCsv, params: { ...paramsParent, margin: [options.paddingParent, 0, 0, 0] } }),
      emptyCell({ isCsv, params: paramsParent }),
      balanceCell(balance, { isCsv, params: paramsParent, type: "rp" })
    ];
    const defChild = [];
    if (accountBalance.children) {
      const paramsChildren = {};
      for (const child of accountBalance.children) {
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
  return accountBalances.reduce((_temp, _account) => {
    const _resultParse = _parseAccount(_account);
    _temp.push(..._resultParse);
    return _temp;
  }, []);
}

function createPdfDef(dataDef = [], { title }: Metadata) {
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
        text: title,
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
