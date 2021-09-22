<!--routify:options title="Edit Kategori Barang"-->

<script>
  import { CategoryProductUpdateSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "../_components/CategoryProductForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getCategoryProduct, categoryProductStore } = stores.getCategoryProductContext();
  const { notify } = getApplicationContext();

  let categoryProduct, loaded = false;

  $: to = $params.to || "../";
  $: {
    if (!loaded && $categoryProductStore) {
      categoryProduct = getCategoryProduct($params.id);
      loaded = true;
    }
  }

  async function onSubmit({ id, ...values }) {
    await update(categoryProduct.id, values);
    notify(`Berhasil mengupdate data kategori barang`, "success");
  }
</script>

{#if categoryProduct}
  <CategoryInventoryForm
    {categoryProduct}
    schema={CategoryProductUpdateSchema}
    isUpdate
    {onSubmit}
    title="Update Kategori Barang"
    {to}
  />
{/if}
