<!--routify:options title="Posting Data"-->
<script>
  import { goto, params } from "@roxi/routify";
  import { CashierInputSchema as schema } from "@deboxsoft/lc-cashier-api";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import CashierForm from "./_components/CashierForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "__@comps/Modal.svelte";

  const { notify, loading } = getApplicationContext();
  const { getUserId, getGroup } = getAuthenticationContext();
  const { create } = getCashierContext();

  let cashier,
    openDialog,
    fields,
    submitting = false,
    isValid;

  $: {
    if (openDialog) {
      openDialog();
    }
  }

  initial();
  async function initial() {
    const date = new Date();
    const userId = getUserId();
    const group = await getGroup(userId);

    const cashierAccount = group.metadata?.cashierAccount;
    cashier = {
      date,
      creditAccounts: [{}],
      userId,
      debitAccount: cashierAccount
    };
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await create(input);
      closeHandler();
      notify("Data berhasil disimpan", "success");
    } catch (e) {
      console.error(e);
      notify(e.message, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto($params.to || "./");
  }
</script>

<Modal bind:openDialog title="Form Kasir" onClose={closeHandler} class="modal-lg" loading={!cashier}>
  <CashierForm {schema} {cashier} bind:isValid bind:fields />
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
