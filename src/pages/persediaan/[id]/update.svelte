<!--routify:options title="Edit Data"-->

<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormInventory from "../_components/FormStock.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update } = stores.getStockTransferContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: stock = getBdd($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($stock.id, values);
      notify(`Berhasil mengupdate data bdd`, "success");
      $loading = false;
    } catch (e) {
      if (e.message) {
        notify(e.message, "error");
      }
      console.error(e);
      $loading = false;
    }
  }
</script>
{#if $stock}
  <FormInventory bank={$stock} isUpdate {onSubmit} title="Update Stock" {to} />
{/if}