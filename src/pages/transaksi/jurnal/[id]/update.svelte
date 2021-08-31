<!--routify:options title="Edit Transaksi"-->
<script>
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import FormJournal from "../_forms/FormJournal.svelte";
  import { getAclContext } from "../_acl-context";

  // context
  const { notify, loading } = getApplicationContext();
  const { update, getTransaction } = stores.getTransactionContext();
  const { accountStore } = stores.getAccountContext();
  const { updateGranted } = getAclContext();

  let transaction,
    open = false;
  $: _transaction = getTransaction($params.id);
  $: {
    if ($_transaction) {
      if (!updateGranted($_transaction.userId)) {
        $goto("/access-denied");
      } else {
        open = true;
        transaction = { ...$_transaction, date: new Date($_transaction.date) };
        delete transaction.status;
      }
    }
  }

  async function submitHandler({ detail: values }) {
    $loading = true;
    try {
      await update($params.id, values);
      notify(`transaksi id '${$params.id}' berhasil diperbarui`, "success");
      closeHandler();
      $loading = false;
    } catch (e) {
      notify(e.message, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    $goto("../");
  }
</script>

{#if open}
  <FormJournal
    title="Update Transaksi"
    values={transaction}
    loading={$loading}
    on:submit={submitHandler}
    on:cancel={closeHandler}
  />
{/if}
