<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormCategoryInventory from "../../_components/FormBdd.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { updateCategory, getAmortization } = stores.getBddContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: categoryAmortization = getAmortization($params.category);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($categoryAmortization.id, values);
      notify(`Berhasil mengupdate data kategori Amortisasi`, "success");
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
{#if $categoryAmortization}
  <FormCategoryInventory bank={$categoryAmortization} isUpdate {onSubmit} title="Update Kategori Amortisasi" {to} />
{/if}