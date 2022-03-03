<!--routify:options title="Edit Data"-->
<script>
  import { PurchaseStockTransactionInputSchema, StockOutTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import ApproveForm from "../_components/ApproveForm.svelte";
  import { getAclContext } from "../../_acl-context";
  import Modal from "__@comps/Modal.svelte";
  import { onMount } from "svelte";

  // context
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { update, findById } = stores.getStockTransactionContext();
  const { accountStore } = stores.getAccountContext();

  let stockTransaction,
    openDialog,
    fields,
    schema,
    submitting = false,
    ready = false,
    isValid;

  onMount(() => {
    findById($params.id).then((_) => {
      stockTransaction = _;
    });
  });

  $: {
    if (!ready && stockTransaction && openDialog) {
      ready = true;
      schema =
        stockTransaction.mutation === "STOCK_IN"
          ? PurchaseStockTransactionInputSchema.partial()
          : StockOutTransactionInputSchema.partial();
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
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "../");
  }
</script>

<Modal class="modal-lg" bind:openDialog title="Edit Data" onClose={closeHandler} loading={!stockTransaction}>
  <ApproveForm
    {schema}
    {stockTransaction}
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
