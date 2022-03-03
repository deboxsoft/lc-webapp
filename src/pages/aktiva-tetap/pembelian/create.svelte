<!--routify:options title="Posting Aktiva Tetap"-->
<script>
  import { InventoryTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import PurchaseForm from "./_components/PurchaseForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Modal from "__@comps/Modal.svelte";
  import { goto, params } from "@roxi/routify";

  const { authenticationStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();
  const { create } = stores.getInventoryTransactionContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let inventoryTransaction,
    openDialog,
    fields,
    submitting = false,
    isValid;
  const schema = InventoryTransactionInputSchema.omit({
    date: true,
    status: true
  });
  (async () => {
    const now = await getCurrentDate();
    inventoryTransaction = {
      userId: $authenticationStore?.profile?.session?.userId,
      datePurchase: now
    };
    openDialog();
  })();

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await create(input);
      closeHandler();
      notify(`Data berhasil tersimpan.`, "success");
    } catch (error) {
      console.error(error);
      notify(error.message, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }
  function closeHandler() {
    $goto($params.to || "./");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Posting Data Baru" onClose={closeHandler} loading={!inventoryTransaction}>
  <PurchaseForm
    {schema}
    {inventoryTransaction}
    isUpdate
    bind:isValid
    bind:fields
    onSubmit={submitHandler}
    onClose={closeHandler}
  />
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
