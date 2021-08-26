<!--routify:options title="Edit Aktiva Tetap"-->
<script>
  import { InventoryUpdateInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import InventoryForm from "../../_components/InventoryForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getInventory, inventoryStore } = stores.getInventoryContext();
  const { notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: inventory = $inventoryStore && getInventory($params.id);

  async function onSubmit({ id, ...values }) {
    await update(inventory.id, values);
    notify(`Berhasil mengupdate data aktiva tetap`, "success");
  }
</script>

{#if inventory}
  <InventoryForm {inventory} schema={InventoryUpdateInputSchema} isUpdate {onSubmit} title="Update Aktiva Tetap" {to} />
{/if}
