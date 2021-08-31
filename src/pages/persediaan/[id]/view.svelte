<!--routify:options title="Detail Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import StockView from "../_components/StockView.svelte";

  const { getStock, stockStore } = stores.getStockTransferContext();

  export let to = "../";
  let openDialog, stock;

  $: {
    if ($stockStore && openDialog) {
      stock = getStock($params.id);
      if (stock) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto(to, {});
  }
</script>

<Modal title="Detail Persediaan Barang" bind:openDialog onClose={closeHandler}>
  <StockView {stock} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
