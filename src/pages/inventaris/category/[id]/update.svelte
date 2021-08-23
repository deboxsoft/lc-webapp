<!--routify:options title="Edit Kategori Inventaris"-->

<script>
  import { CategoryInventoryUpdateInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "../../_components/CategoryInventoryForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { updateCategory, getCategoryInventory, categoryInventoryStore } = stores.getInventoryContext();
  const { notify } = getApplicationContext();

  let categoryInventory, loaded = false;

  $: to = $params.to || "../";
  $: {
    if (!loaded && $categoryInventoryStore) {
      categoryInventory = getCategoryInventory($params.id);
      loaded = true;
    }
  }

  async function onSubmit({ id, ...values }) {
    await updateCategory(categoryInventory.id, values);
    notify(`Berhasil mengupdate data kategori inventaris`, "success");
  }
</script>

{#if categoryInventory}
  <CategoryInventoryForm
    {categoryInventory}
    schema={CategoryInventoryUpdateInputSchema}
    isUpdate
    {onSubmit}
    title="Update Kategori Inventaris"
    {to}
  />
{/if}
