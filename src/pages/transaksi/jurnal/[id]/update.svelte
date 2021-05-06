<!--routify:options title="update Transaksi"-->
<script>
  import { params, goto } from "@roxi/routify";
  import { getAccountContext, getTransactionContext } from "__@modules/accounting";
  import { getApplicationContext } from "__@modules/app";
  import Modal from "__@comps/Modal.svelte";
  import FormJournal from "../_forms/FormJournal.svelte";

  // context
  const { notify, loading } = getApplicationContext();
  const { update, getTransaction } = getTransactionContext();
  const { accountStore } = getAccountContext();

  let transaction;
  $: _transaction = getTransaction($params.id);
  $: {
    if ($_transaction) {
      transaction = { ...$_transaction, date: new Date($_transaction.date) };
    }
  }

  async function submitHandler({ detail: values }) {
    $loading = true;
    try {
      await update($params.id, values);
      notify(`transaksi id '${$params.id}' berhasil diperbarui`, "success");
      $goto("../");
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function cancelHandler() {
    $goto("../");
  }
</script>

{#if transaction}
  <Modal title="Update Transaksi" class="modal-lg">
    <div class="d-flex flex-column h-100">
      <FormJournal values={transaction} loading={$loading} on:submit={submitHandler} on:cancel={cancelHandler} />
    </div>
  </Modal>
{/if}
