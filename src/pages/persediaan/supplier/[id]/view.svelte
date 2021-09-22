<!--routify:options title="Detail Supplier"-->

<script>
  import { goto, params } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { stores } from "@deboxsoft/accounting-client";
  import SupplierView from "../_components/SupplierView.svelte";

  const { getSupplier, supplierStore } = stores.getSupplierContext();

  let openDialog, supplier;

  $: {
    if ($supplierStore && openDialog) {
      supplier = getSupplier($params.id);
      if (supplier) {
        openDialog();
      }
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

<Modal title="Info Data Supplier" bind:openDialog onClose={closeHandler}>
  <SupplierView {supplier} />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Close
    </button>
  </svelte:fragment>
</Modal>
