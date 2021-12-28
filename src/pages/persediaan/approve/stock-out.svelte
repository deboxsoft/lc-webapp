<!--routify:options title="Barang Keluar"-->
<script>
  import { StockOutTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import ApproveForm from "./_components/ApproveForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Modal from "__@comps/Modal.svelte";
  import { getAclContext } from "../_acl-context";

  const { createGranted } = getAclContext();
  const schema = StockOutTransactionInputSchema.omit({ status: true });
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { loading, notify } = getApplicationContext();
  const { stockOut, stockStore, getStock } = stores.getStockTransactionContext();
  const { authenticationStore } = getAuthenticationContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let stockTransaction,
    openDialog,
    fields,
    isValid,
    submitting = false;

  (async () => {
    const now = await getCurrentDate();
    stockTransaction = {
      userId: $authenticationStore?.profile?.session?.userId,
      datePurchase: now,
      mutation: "STOCK-OUT"
    };
    openDialog();
  })();

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await stockOut(input);
      closeHandler();
      notify(`Barang berhasil tersimpan`, "success");
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

<Modal class="modal-lg" bind:openDialog title="Form Barang Keluar" onClose={closeHandler} loading={!stockTransaction}>
  <ApproveForm {stockTransaction} {schema} bind:fields bind:isValid />
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
