<!--routify:options title="Detail Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import CashierView from "../_components/CashierView.svelte";
  import Modal from "../../../../components/Modal.svelte";

  const { getCashier, cashierStore } = getCashierContext();
  let closeUrl = $params.closeUrl || "../";
  let openDialog, cashier;
  $: {
    if ($cashierStore && openDialog) {
      cashier = getCashier($params.id);
      if (cashier) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto(closeUrl, {});
  }
</script>

<Modal title="Detail Data Kasir" bind:openDialog onClose={closeHandler}>
  <svelte:fragment slot="footer">
    <CashierView {cashier} />
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
