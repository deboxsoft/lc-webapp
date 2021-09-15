<!--routify:options title="Rekap Amortization"-->

<script>
  import { params, goto } from "@roxi/routify";
  import Modal from "../../../../components/Modal.svelte";
  import AmortizationTable from "../../_components/AmortizationTable.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getBdd, bddStore } = stores.getBddContext();

  let openDialog, bdd;

  $: {
    if ($bddStore && openDialog) {
      bdd = $bddStore && getBdd($params.id);
      if (bdd) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>
<Modal bind:openDialog title="Rekap Amortisasi" onClose={closeHandler}>
  <AmortizationTable {bdd} />
  <svelte:fragment slot="footer">
    <button class="btn btn-outline bg-primary text-primary border-primary " on:click={closeHandler}>Tutup</button>
  </svelte:fragment>
</Modal>