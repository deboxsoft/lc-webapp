<!--routify:options title="Posting Aktiva Tetap"-->
<script>
  import { InventoryInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import InventoryForm from "../_components/InventoryForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";

  const { authenticationStore } = getAuthenticationContext();
  const { notify } = getApplicationContext();
  const { create } = stores.getInventoryContext();

  const inventory = {
    date: new Date(),
    quantity: 1,
    userId: $authenticationStore?.profile?.session?.userId
  };

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data aktiva tetap ${values.name}`, "success");
  }
</script>

{#if inventory}
  <InventoryForm {inventory} schema={InventoryInputSchema} title="Posting Aktiva Tetap" {onSubmit} />
{/if}
