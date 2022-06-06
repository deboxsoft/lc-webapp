<!--routify:options title="Edit Data"-->
<script>
  import { CashierInputSchema } from "@deboxsoft/lc-cashier-api";
  import { params, goto } from "@roxi/routify";
  import { getCashierContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import CashierForm from "../_components/CashierForm.svelte";
  import { getAclContext } from "__@root/utils";
  import Modal from "__@comps/Modal.svelte";

  // context
  const { notify, loading } = getApplicationContext();
  const { update, cashierStore, getCashier } = getCashierContext();
  const { updateGranted } = getAclContext();
  const schema = CashierInputSchema.partial();

  $: to = $params.to || "../";
  let cashier, openDialog, fields, submitting, isValid;

  $: {
    if (openDialog) {
      openDialog();
    }
  }

  $: {
    if ($params.id && $cashierStore) {
      cashier = getCashier($params.id);
      if (!cashier || !updateGranted) {
        $goto("/access-denied");
      }
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await update($params.id, input);
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
    $goto($params.to || "../");
  }
</script>

<Modal bind:openDialog title="Edit Data Kasir" onClose={closeHandler} class="modal-lg" loading={!cashier}>
  <CashierForm {schema} isUpdate title="Edit Kasir" {cashier} bind:fields bind:isValid />
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
