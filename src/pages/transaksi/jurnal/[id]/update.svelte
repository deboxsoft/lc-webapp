<!--routify:options title="update Transaksi"-->
<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import Modal from "__@comps/Modal.svelte";
  import FormJournal from "../_forms/FormJournal.svelte";
  import { getAclContext } from "../_acl-context";

  // context
  const { notify, loading } = getApplicationContext();
  const { update, getTransaction } = stores.getTransactionContext();
  const { accountStore } = stores.getAccountContext();
  const { updateGranted } = getAclContext();


  let transaction;
  $: _transaction = getTransaction($params.id);
  $: {
    if ($_transaction) {
      if (!updateGranted($_transaction.userId)) {
        $goto("/access-denied");
      } else {
        transaction = { ...$_transaction, date: new Date($_transaction.date) };
      }
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

{#if transaction && updateGranted(transaction.userId)}
  <Modal title="Update Transaksi" class="modal-lg" onClose={cancelHandler}>
    <div class="d-flex flex-column h-100">
      <FormJournal values={transaction} loading={$loading} on:submit={submitHandler} on:cancel={cancelHandler} />
    </div>
  </Modal>
{/if}
