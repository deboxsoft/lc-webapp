<!--routify:options title="Edit Data"-->
<script>
  import { CashierUpdateSchema } from "@deboxsoft/lc-cashier-api";
  import { params, goto } from "@roxi/routify";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import CashierForm from "../_components/CashierForm.svelte";
  import { getAclContext } from "__@root/utils";

  // context
  const { notify } = getApplicationContext();
  const { update, cashierStore, getCashier } = getCashierContext();
  const { updateGranted } = getAclContext();

  $: to = $params.to || "../";
  let cashier,
    submitHandler,
    loaded = false;
  $: {
    if ($params.id && $cashierStore) {
      cashier = getCashier($params.id)
      if (!cashier || !updateGranted(cashier.userId)) {
        $goto("/access-denied");
      } else {
        loaded = true;
      }
    }
  }

  async function onSubmit(input) {
    await update(cashier.id, input);
    notify(`transaksi pembayaran berhasil diedit`, "success");
  }
</script>

{#if loaded}
  <CashierForm
    schema={CashierUpdateSchema}
    isUpdate
    title="Edit Kasir"
    {cashier}
    on:submit={submitHandler}
    {to}
  />
{/if}
