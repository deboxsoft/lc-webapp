<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormInventory from "../../_components/FormBdd.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getBdd } = stores.getBddContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: bdd = getBdd($params.id);

  async function onSubmit({ id, ...values }) {
    try {
      $loading = true;
      await update($bdd.id, values);
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
{#if $bdd}
  <FormInventory bank={$bdd} isUpdate {onSubmit} title="Update Bdd" {to} />
{/if}