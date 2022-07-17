import { GeneralLedger, dayjs } from "@deboxsoft/accounting-api";
import { pdfMake, pdfStyles } from "__@root/styles/pdf";
import { downloadCsv, emptyCell, numericCell, textCell } from "__@root/utils";
const options = {
  formatDate: "DD MMMM YYYY"
};

export type Metadata = Record<string, string>;
export const createReportContext = () => {
  const processingData = (items: GeneralLedger[], isCsv = false, metadata: Metadata) => {
    const _generalLedgerTransform = (generalLedger: GeneralLedger) => {
      const date = dayjs(generalLedger.date).format(options.formatDate);
      const amount = generalLedger.amount;
      return [
        textCell(date, { isCsv }),
        textCell(generalLedger.transactionId, { isCsv }),
        textCell(generalLedger.description, { isCsv }),
        amount > 0 ? numericCell(amount, { isCsv }) : emptyCell({ isCsv }),
        amount > 0 ? emptyCell({ isCsv }) : numericCell(-1 * amount, { isCsv }),
        numericCell(generalLedger.balance, { isCsv })
      ];
    };
    return items.map(_generalLedgerTransform);
  };
  return {
    pdf: (items, progressCB, metadata: Metadata = {}) => {
      const now = new Date();
      const doc = createPdfDef(processingData(items, false, metadata), metadata);
      return pdfMake(doc).download(metadata.filename || `trial-balance-${now.getTime()}.pdf`, null, {
        progressCallback: progressCB
      });
    },
    csv: (items, metadata: Metadata = {}) => {
      const now = new Date();
      downloadCsv(processingData(items, true, metadata), `trial-balance-${now.getTime()}.csv`);
    },
    print: (items, metadata: Metadata = {}) => {
      const doc = createPdfDef(processingData(items, false, metadata), metadata);
      return pdfMake(doc).print();
    }
  };
};

function createPdfDef(dataDef = [], { startDate, endDate }: Metadata) {
  const from = dayjs(startDate).format(options.formatDate).toUpperCase();
  const to = dayjs(endDate).format(options.formatDate).toUpperCase();
  const headerDef = [
    {
      text: "TANGGAL",
      alignment: "center",
      style: "header"
    },
    {
      text: "NO TRANSAKSI",
      alignment: "center",
      style: "header"
    },
    {
      text: "DESKRIPSI",
      alignment: "center",
      style: "header"
    },
    {
      text: "DEBIT",
      alignment: "center",
      style: "header"
    },
    {
      text: "KREDIT",
      alignment: "center",
      style: "header"
    },
    {
      text: "SALDO",
      alignment: "center",
      style: "header"
    }
  ];
  return {
    pageOrientation: "landscape",
    content: [
      {
        text: `TRIAL BALANCE: PER ${from} - ${to}`,
        style: "title",
        alignment: "center"
      },
      {
        style: "cell",
        table: {
          headerRows: 1,
          widths: ["auto", "auto", "*", "auto", "auto", "auto"],
          body: [headerDef, ...dataDef]
        }
      }
    ],
    styles: pdfStyles
  };
}
