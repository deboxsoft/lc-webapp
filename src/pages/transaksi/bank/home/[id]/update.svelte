<!--routify:options title="Edit Data"-->
<script>
  import { BankInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import BankForm from "../_components/BankForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getBank, bankStore } = stores.getBankContext();
  const { loading, notify } = getApplicationContext();

  $: bank = getBank($params.id);

  async function onSubmit({ id, ...values }) {
    await update($params.id, values);
    notify(`Berhasil mengupdate data bank`, "success");
  }
</script>

{#if bank}
  <BankForm bank={$bank} schema={BankInputSchema} {onSubmit} title="Update Bank" to={$params.to} />
{/if}
