<!--routify:options title="Pembelian Barang"-->
<script>
  import { PurchaseStockTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { goto, params } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import ApproveForm from "./_components/ApproveForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import Modal from "__@comps/Modal.svelte";
  import { getAclContext } from "__@root/utils";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { purchase } = stores.getStockTransactionContext();
  const { authenticationStore } = getAuthenticationContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();
  const schema = PurchaseStockTransactionInputSchema.omit({
    status: true
  });

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
      mutation: "STOCK_IN"
    };
    openDialog();
  })();

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse({
        ...$fields,
        mutation: "STOCK_IN"
      });
      await purchase(input);
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

<Modal
  class="modal-lg"
  bind:openDialog
  title="Form Pembelian Persediaan"
  onClose={closeHandler}
  loading={!stockTransaction}
>
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
