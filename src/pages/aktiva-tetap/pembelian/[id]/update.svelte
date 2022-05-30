<!--routify:options title="Edit Data"-->
<script>
  import { InventoryTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import PurchaseForm from "../_components/PurchaseForm.svelte";
  import { getAclContext } from "../../_acl-context";
  import Modal from "__@comps/Modal.svelte";

  // context
  const schema = InventoryTransactionInputSchema.omit({
    datePurchase: true,
    date: true,
    status: true
  });
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { update, inventoryTransactionStore } = stores.getInventoryTransactionContext();
  const { accountStore } = stores.getAccountContext();

  let inventoryTransaction,
    openDialog,
    fields,
    ready = false,
    isValid,
    submitting = false;
  $: {
    if (!ready && $inventoryTransactionStore && openDialog) {
      ready = true;
      const i = $inventoryTransactionStore.findIndex((_) => _.id === $params.id);
      inventoryTransaction = $inventoryTransactionStore[i];
      openDialog();
    }
  }

  async function submitHandler(values) {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await update($params.id, input);
      notify(`Berhasil memperbarui data`, "success");
      closeHandler();
    } catch (e) {
      notify(e.message, "error");
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "../");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Edit Data" onClose={closeHandler} loading={!inventoryTransaction}>
  <PurchaseForm {schema} {inventoryTransaction} bind:isValid bind:fields />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
