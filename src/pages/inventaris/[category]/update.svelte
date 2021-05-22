<script>
  import { params, goto } from "@roxi/routify";
  import { getInventoryContext } from "__@modules/accounting";
  import FormCategoryInventory from "../_components/FormCategoryInventory.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { updateCategory, getCategoryInventory } = getInventoryContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: categoryInventory = getCategoryInventory($params.category);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($categoryInventory.id, values);
      notify(`Berhasil mengupdate data kategori inventaris`, "success");
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
{#if $categoryInventory}
  <FormCategoryInventory bank={$categoryInventory} isUpdate {onSubmit} title="Update Kategori Inventaris" {to} />
{/if}