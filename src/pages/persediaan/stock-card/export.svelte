<script>
  import { onMount } from "svelte";
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import StockFilterForm from "./_components/StockFilterForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { createReportContext } from "./_export";

  const { stockReport, categoryContext, categoryStore } = stores.getStockContext();
  const {getCategoryProduct} = categoryContext;
  const { loading } = getApplicationContext();
  const reportContext = createReportContext();

  export let onProgress = () => {};

  let submitFilter, openDialog, isStartup = false;

  $: {
    if (isStartup && !$categoryStore) {

    }
  }

  onMount(() => {
    openDialog();
  });



  function parsingData() {
    const filter = submitFilter();
    return stockReport(filter);
  }
    // extract category
  function extractDataByCategory(dataList) {
    return dataList.reduce((result, _) => {
      const _cat = result[_.categoryId];
      if (!_cat) {
        result[_.categoryId] = {
          name: getCategoryProduct(_.categoryId).name,
          data: [_]
        }
      } else {
        _cat.data.push(_);
      }
      return result;
    }, {})
  }

  async function downloadPdfHandler() {
    $loading = true;
    const data = await parsingData();
    reportContext.pdf(extractDataByCategory(data));
    $loading = false;
    closeHandler();
  }

  async function printHandler() {
    $loading = true;
    const data = await parsingData();
    reportContext.print(extractDataByCategory(data));
    $loading = false;
    closeHandler();
  }

  async function downloadCsvHandler() {
    $loading = true;
    const data = await parsingData();
    reportContext.csv(data);
    $loading = false;
    closeHandler();
  }

  function closeHandler() {
    $goto("./");
  }
</script>

<StockFilterForm title="Ekspor" bind:openDialog bind:submit={submitFilter} onClose={closeHandler}>
  <div slot="footer">
    <button class="btn btn-primary" on:click={downloadPdfHandler}><i class="icon-file-pdf mr-2" />Download PDF</button>
    <button class="btn btn-primary" on:click={downloadCsvHandler}><i class="icon-file-excel mr-2" />Download CSV</button
    >
    <button class="btn btn-primary" on:click={printHandler}><i class="icon-printer2 mr-2" />Cetak</button>
  </div>
</StockFilterForm>
