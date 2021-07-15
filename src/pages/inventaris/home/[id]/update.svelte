<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormInventory from "../../_components/FormInventory.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getInventory } = stores.getInventoryContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: inventory = getInventory($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($inventory.id, values);
      notify(`Berhasil mengupdate data inventaris`, "success");
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
{#if $inventory}
  <FormInventory bank={$inventory} isUpdate {onSubmit} title="Update Inventaris" {to} />
{/if}