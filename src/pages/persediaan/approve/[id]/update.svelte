<!--routify:options title="Edit Data"-->
<script>
  import { StockTransactionInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import ApproveForm from "../_components/ApproveForm.svelte";
  import { getAclContext } from "../../_acl-context";
  import Modal from "__@comps/Modal.svelte";

  // context
  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { notify, loading } = getApplicationContext();
  const { update, stockTransactionStore } = stores.getStockTransactionContext();
  const { accountStore } = stores.getAccountContext();

  let stockTransaction,
    openDialog,
    fields,
    ready = false,
    isValid;
  const schema =
    stockTransaction.mutation === "STOCK-IN"
      ? PurchaseStockTransactionInputSchema.partial()
      : StockOutTransactionInputSchema.partial();
  $: {
    if (!ready && $stockTransactionStore && openDialog) {
      ready = true;
      const i = $stockTransactionStore.findIndex((_) => _.id === $params.id);
      stockTransaction = $stockTransactionStore[i];
      openDialog();
    }
  }

  async function submitHandler(values) {
    try {
      $loading = true;
      const input = schema.parse($fields);
      await update($params.id, input);
      notify(`Berhasil memperbarui data`, "success");
      closeHandler();
    } catch (e) {
      notify(e.message, "error");
    } finally {
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
</Modal>
