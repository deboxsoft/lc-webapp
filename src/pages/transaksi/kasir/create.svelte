<!--routify:options title="Posting Data"-->
<script>
  import { CashierCreateSchema } from "@deboxsoft/lc-cashier-api";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import CashierForm from "./_components/CashierForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "../../../modules/users";
  import { stores } from "@deboxsoft/accounting-client";

  const { notify } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { create } = getCashierContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let cashier;
  (async () => {
    const now = await getCurrentDate();
    cashier = {
      creditAccounts: [{}],
      userId: getUserId()
    };
  })();

  async function onSubmit(values) {
    await create(values);
    notify(`Posting data kasir berhasil tersimpan.`, "success");
  }
</script>

{#if cashier}
  <CashierForm schema={CashierCreateSchema} {cashier} title="Posting Pembayaran" {onSubmit} />
{/if}
