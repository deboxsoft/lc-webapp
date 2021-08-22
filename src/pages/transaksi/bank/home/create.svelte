<!--routify:options title="Posting Data"-->
<script>
  import { goto } from "@roxi/routify";
  import { BankInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import BankForm from "./_components/BankForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";

  const { createGranted } = getAclContext();
  if (!createGranted) {
    $goto("/access-denied");
  }
  const { notify } = getApplicationContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();
  const { create } = stores.getBankContext();

  let bank;
  (async () => {
    const date = await getCurrentDate();
    bank = {
      date
    };
  })();

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data bank ${values.name}`, "success");
  }

  $: console.log(bank);
</script>

{#if bank}
  <BankForm {bank} schema={BankInputSchema} title="Membuat Data Bank" {onSubmit} />
{/if}
