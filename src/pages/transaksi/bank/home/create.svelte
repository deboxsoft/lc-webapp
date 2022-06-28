<!--routify:options title="Posting Data"-->
<script>
  import { goto } from "@roxi/routify";
  import { BankInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import BankForm from "./_components/BankForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "__@root/utils";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify } = getApplicationContext();
  const { create } = stores.getBankContext();

  const bank = {
    date: new Date()
  };

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data bank ${values.name}`, "success");
  }
</script>

{#if bank}
  <BankForm {bank} schema={BankInputSchema} title="Membuat Data Bank" {onSubmit} />
{/if}
