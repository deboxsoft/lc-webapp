import type { AccountBalance, BalanceSheetReport } from "@deboxsoft/accounting-api";
import dayjs from "dayjs";
import type { Writable } from "svelte/store";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, numericCell as balanceCell, textCell as nameCell, emptyCell } from "__@root/utils";

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
  generateReport: (balanceSheetReport: BalanceSheetReport, opts: GenerateReportOptions) => any;
  title: string;
  loading: Writable<boolean>;
}

export interface ReportOptions {
  balanceSheetReport: BalanceSheetReport;
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

export type Metadata = Record<string, any>;
export const statementBalanceContext = (opts: Omit<CreateReportOptions, "generateReport">) => {
  return createReportContext({
    ...opts,
    generateReport: (balanceSheetReport: BalanceSheetReport, { isCsv, paramsSubtotal, paramsTotal }) => {
      const statementIncome = balanceSheetReport.statementIncome;
      const accountsBalance = balanceSheetReport.accountsBalance;
      return [
        ...parsingAccountsBalance(
          statementIncome.revenue.accountsIndex.map((_index) => accountsBalance[_index]),
          { isCsv }
        ),
        parsingSumBalance("TOTAL PENDAPATAN", statementIncome.revenue.balance, {
          isCsv,
          params: paramsSubtotal
        }),
        ...parsingAccountsBalance(
          statementIncome.expense.accountsIndex.map((_index) => accountsBalance[_index]),
          { isCsv }
        ),
        parsingSumBalance("TOTAL BIAYA", statementIncome.expense.balance, {
          isCsv,
          params: paramsSubtotal
        }),
        parsingSumBalance("LABA/RUGI", statementIncome.profit, {
          isCsv,
          params: paramsTotal
        })
      ];
    }
  });
};
export const balanceSheetContext = (opts: Omit<CreateReportOptions, "generateReport">) => {
  return createReportContext({
    ...opts,
    generateReport: (balanceSheetReport: BalanceSheetReport, { isCsv, paramsSubtotal, paramsTotal }) => {
      const accountsBalance = balanceSheetReport.accountsBalance;
      return [
        ...parsingAccountsBalance(
          balanceSheetReport.assets.accountsIndex.map((_index) => accountsBalance[_index]),
          { isCsv }
        ),
        parsingSumBalance("TOTAL AKTIVA", balanceSheetReport.assets.balance, {
          isCsv,
          params: paramsSubtotal
        }),
        ...parsingAccountsBalance(
          balanceSheetReport.payable.accountsIndex.map((_index) => accountsBalance[_index]),
          { isCsv }
        ),
        ...parsingAccountsBalance(
          balanceSheetReport.equities.accountsIndex.map((_index) => accountsBalance[_index]),
          { isCsv }
        ),
        parsingSumBalance("TOTAL PASIVA", balanceSheetReport.liabilities, {
          isCsv,
          params: paramsSubtotal
        }),
        parsingSumBalance("LABA/RUGI", balanceSheetReport.statementIncome.profit, {
          isCsv,
          params: paramsSubtotal
        }),
        parsingSumBalance("SELISIH", balanceSheetReport.assets.balance - balanceSheetReport.liabilities, {
          isCsv,
          params: paramsTotal
        })
      ];
    }
  });
};
export const createReportContext = (opts: CreateReportOptions) => {
  const processingData = (balanceSheetReport: BalanceSheetReport, isCsv = false) => {
    const paramsSubtotal = {
      fillColor: options.backgroundColorSubtotal
    };
    const paramsTotal = {
      fillColor: options.backgroundColorTotal
    };
    return opts.generateReport(balanceSheetReport, {
      isCsv,
      paramsSubtotal,
      paramsTotal
    });
  };
  return {
    pdf: ({ balanceSheetReport, date = new Date(), filename }: ReportOptions) => {
      opts.loading.set(true);
      const now = new Date();
      const reportDesc = processingData(balanceSheetReport);
      const doc = createPdfDef(reportDesc, { title: opts.title, date });
      pdfMake(doc).download(filename || `${opts.title}-${now.getTime()}.pdf`, null, {
        progressCallback: (p) => {
          if (p === 1) {
            opts.loading.set(false);
          }
        }
      });
      opts.close && opts.close();
    },
    csv: ({ balanceSheetReport, date = new Date() }: ReportOptions) => {
      opts.loading.set(true);
      const now = new Date();
      downloadCsv(processingData(balanceSheetReport, true), `${opts.title}-${now.getTime()}.csv`);
      opts.loading.set(false);
      opts.close && opts.close();
    },
    print: ({ balanceSheetReport, date = new Date() }: ReportOptions) => {
      opts.loading.set(true);
      const doc = createPdfDef(processingData(balanceSheetReport), { title: opts.title, date });
      pdfMake(doc).print();
      opts.loading.set(false);
      opts.close && opts.close();
    }
  };
};

function parsingAccountsBalance(
  accountBalances: AccountBalance[],
  { isCsv = false }: Pick<GenerateReportOptions, "isCsv">
) {
  const _parseAccount = (accountBalance: AccountBalance) => {
    const paramsParent = {
      fillColor: options.backgroundColorParent
    };
    const defParent = [
      nameCell(accountBalance.name, { isCsv, params: { ...paramsParent, margin: [options.paddingParent, 0, 0, 0] } }),
      emptyCell({ isCsv, params: paramsParent }),
      balanceCell(accountBalance.balance, { isCsv, params: paramsParent, type: "rp" }),
      emptyCell({ isCsv, params: paramsParent })
    ];
    const defChild = [];
    if (accountBalance.children) {
      const paramsChildren = {};
      for (const child of accountBalance.children) {
        defChild.push([
          nameCell(child.name, { isCsv, params: { ...paramsChildren, margin: [options.paddingChild, 0, 0, 0] } }),
          balanceCell(child.balance, { isCsv, params: paramsChildren, type: "rp" }),
          emptyCell({ isCsv, params: paramsChildren }),
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

function parsingSumBalance(
  label,
  balance,
  { isCsv = false, params = {} }: Pick<GenerateReportOptions, "isCsv"> & { params: Record<string, any> }
) {
  return [
    nameCell(label, { isCsv, params }),
    emptyCell({ isCsv, params }),
    emptyCell({ isCsv, params }),
    balanceCell(balance, { isCsv, params, type: "rp" })
  ];
}

function createPdfDef(dataDef = [], { title, date = new Date() }: Metadata) {
  const perDate = dayjs(date).format(options.formatDate).toUpperCase();
  const headerDef = [
    {
      text: "AKUN PERKIRAAN",
      alignment: "center",
      style: "header"
    },
    {
      text: "SALDO",
      alignment: "center",
      colSpan: 3,
      style: "header"
    },
    {},
    {}
  ];
  return {
    content: [
      {
        text: `LAPORAN: ${title} - PER ${perDate}`,
        style: "title",
        alignment: "center"
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
