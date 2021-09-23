<!--routify:options title="Posting Data"-->
<script>
  import { CashierCreateSchema } from "@deboxsoft/lc-cashier-api";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import CashierForm from "./_components/CashierForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "__@comps/Modal.svelte";

  const { notify } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { create } = getCashierContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let cashier,
    openDialog,
    fields,
    submitting = false,
    ready = false,
    isValid;

  $: {
    if (openDialog && !ready) {
      ready = true;
      openDialog();
    }
  }

  initial();
  async function initial() {
    const date = await getCurrentDate();
    const userId = getUserId();
    const group = await getGroup(userId);

    const cashierAccount = group.metadata?.cashierAccount;
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
