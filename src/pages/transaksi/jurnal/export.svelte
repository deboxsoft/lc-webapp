<script>
  import { onMount } from "svelte";
  import { goto } from "@roxi/routify";
  import { stores, getTransactionService } from "@deboxsoft/accounting-client";
  import { get } from "svelte/store";
  import { pdfMake, pdfStyles } from "__@root/styles/pdf";
  import { downloadCsv, convertToNumber } from "../../../utils";
  import dayjs from "dayjs";
  import FormFilter from "./_forms/FormFilter.svelte";
  import { getApplicationContext } from "__@modules/app";

  const { getAccount } = stores.getAccountContext();
  const { getTransactionType, transaction } = stores.getTransactionContext();
  const transactionService = getTransactionService();
  const { loading } = getApplicationContext();

  export let onProgress = () => {};

  let submitFilter, openDialog;

  onMount(() => {
    openDialog();
  });

  function processingDataPdf(list = [], transaction) {
    const debitAccount = get(getAccount(transaction.accountId)) || {};
    return [
      ...list,
      [
        { text: transaction.id || "", style: "cell" },
        { text: dayjs(transaction.date).format("DD-MM-YYYY") || "", style: "cell" },
        { text: transaction.description || "", style: "cell" },
        { text: get(getTransactionType(transaction.type))?.name || "-" },
        { text: transaction.status || "", style: "cell", align: "center" }
      ],
      [
        {
          style: "cell",
          table: {
            widths: [70, "*", "auto", "auto"],
            layout: "noBorders",
            body: [
              [
                { text: debitAccount.id, style: "cell", border: [false, false, false, false] },
                { text: debitAccount.name, style: "cell", border: [false, false, false, false] },
                {
                  text: convertToNumber({ value: transaction.amount }),
                  style: "cell-number",
                  border: [false, false, false, false]
                },
                { text: "-", style: "cell-number", border: [false, false, false, false] }
              ],
              ...transaction.creditAccounts.map((_) => {
                const creditAccount = get(getAccount(_.id));
                return [
                  { text: creditAccount.id, style: "cell", border: [false, false, false, false] },
                  { text: creditAccount.name, style: "cell", border: [false, false, false, false] },
                  { text: "-", style: "cell-number", border: [false, false, false, false] },
                  {
                    text: convertToNumber({ value: _.amount }),
                    style: "cell-number",
                    border: [false, false, false, false]
                  }
                ];
              })
            ]
          },
          colSpan: 5
        },
        "",
        "",
        ""
      ]
    ];
  }

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
        text: "JENIS TRANSAKSI",
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
            widths: [70, 60, "*", "auto", "auto"],
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

  function createPdfMake(transactions) {
    const doc = createPdfDef(transactions.reduce(processingDataPdf, []));
    return pdfMake(doc);
  }

  function getTransactions() {
    const filter = submitFilter();
    return transactionService.find(filter);
  }

  async function downloadPdfHandler() {
    $loading = true;
    const now = new Date();
    const transactions = await getTransactions();
    createPdfMake(transactions).download(`transaction-${now.getTime()}.pdf`, null, {
      progressCallback: (p) => {
        if (p === 1) {
          $loading = false;
        }
      }
    });
    closeHandler();
  }

  async function printHandler() {
    $loading = true;
    const transactions = await getTransactions();
    const now = new Date();
    const doc = createPdfMake(transactions).print();
    $loading = false;
    closeHandler();
  }

  async function downloadCsvHandler() {
    $loading = true;
    const transactions = await getTransactions();
    const now = new Date();
    downloadCsv(
      transactions.map((transaction) => {
        const { name: accountDebit = "-" } = get(getAccount(transaction.accountId)) || {};
        return [
          transaction.id,
          dayjs(transaction.date).format("DD-MM-YYYY"),
          transaction.description,
          accountDebit,
          convertToNumber({ value: transaction.amount }),
          transaction.status,
          [
            transaction.creditAccounts.map((_) => {
              const { name: account = "-" } = get(getAccount(_.id)) || {};
              return [account, convertToNumber({ value: _.amount })];
            })
          ]
        ];
      }),
      `transaction-${now.getTime()}.csv`
    );
    $loading = false;
    closeHandler();
  }

  function closeHandler() {
    $goto("./");
  }
</script>

<FormFilter title="Ekspor" bind:openDialog isReport bind:submit={submitFilter} onClose={closeHandler}>
  <div slot="footer">
    <button class="btn btn-primary" on:click={downloadPdfHandler}><i class="icon-file-pdf mr-2" />Download PDF</button>
    <button class="btn btn-primary" on:click={downloadCsvHandler}><i class="icon-file-excel mr-2" />Download CSV</button
    >
    <button class="btn btn-primary" on:click={printHandler}><i class="icon-printer2 mr-2" />Cetak</button>
  </div>
</FormFilter>
