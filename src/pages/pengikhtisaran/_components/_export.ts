import type { Account } from "@deboxsoft/accounting-api";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, numericCell as balanceCell, textCell as nameCell } from "__@root/utils";

const options = {
  paddingChild: 10,
  backgroundColorParent: "#eeeeee",
  backgroundColorSubtotal: "#cccccc",
  backgroundColorTotal: "#999999"
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const processingAccounts = (accounts: Account[], isCsv = false) => {
    const _parseAccount = (account: Account) => {
      const paramsParent = {
        fillColor: options.backgroundColorParent
      };
      const defParent = [
        nameCell(account.name, { isCsv, params: paramsParent }),
        { text: "", ...paramsParent },
        balanceCell(account.balanceFixed, { isCsv, params: paramsParent }),
        { text: "", ...paramsParent }
      ];
      const defChild = [];
      if (account.children) {
        const paramsChildren = {};
        for (const child of account.children) {
          defChild.push([
            nameCell(child.name, { isCsv, params: { ...paramsChildren, margin: [options.paddingChild, 0, 0, 0] } }),
            balanceCell(child.balanceFixed, { isCsv, params: paramsChildren }),
            { text: "", ...paramsChildren },
            { text: "", ...paramsChildren }
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

  const _parseCalculateResult = (label, balance, { isCsv = false, params = {} }) => [
    nameCell(label, { isCsv, params }),
    { text: "", ...params },
    { text: "", ...params },
    balanceCell(balance, { isCsv, params })
  ];

  const processingData = (list: any[], isCsv = false) => {
    const paramsSubtotal = {
      fillColor: options.backgroundColorSubtotal
    };
    const paramsTotal = {
      fillColor: options.backgroundColorTotal
    };
    return [
      ...processingAccounts(list[0]),
      _parseCalculateResult(list[1].label, list[1].balance, { isCsv, params: paramsSubtotal }),
      ...processingAccounts(list[2]),
      _parseCalculateResult(list[3].label, list[3].balance, { isCsv, params: paramsSubtotal }),
      ...list
        .slice(4)
        .map(({ label, balance }) => _parseCalculateResult(label, balance, { isCsv, params: paramsTotal }))
    ];
  };
  return {
    pdf: (list: any[], progressCB, metadata: Metadata = {}) => {
      const now = new Date();
      const reportDesc = processingData(list);
      const doc = createPdfDef(reportDesc, metadata);
      return pdfMake(doc).download(metadata.filename || `${metadata.title}-${now.getTime()}.pdf`, null, {
        progressCallback: progressCB
      });
    },
    csv: (list: any[], metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(processingData(list), `${metadata.title}-${now.getTime()}.csv`);
    },
    print: (list: any[], metadata: Metadata = {}) => {
      const doc = createPdfDef(processingData(list), metadata);
      return pdfMake(doc).print();
    }
  };
};

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
      colSpan: 3,
      style: "header"
    },
    {},
    {}
  ];
  return {
    content: [
      {
        text: `Laporan: ${title}`,
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
