<!--routify:options title="Edit Data"-->
<script>
  import { BddUpdateInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import BddForm from "../../_components/BddForm.svelte";
  import { getApplicationContext } from "../../../../modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, bddStore, getBdd } = stores.getBddContext();
  const { notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: bdd = $bddStore && getBdd($params.id);

  async function onSubmit({ id, ...values }) {
    await update(bdd.id, values);
    notify(`Berhasil mengupdate data bdd`, "success");
  }
</script>

{#if bdd}
  <BddForm
    bdd={{ description: bdd.description, dateStart: bdd.dateStart, dateEnd: bdd.dateEnd }}
    schema={BddUpdateInputSchema}
    isUpdate
    {onSubmit}
    title="Update Bdd"
    {to}
  />
{/if}
