<!--routify:options title="Transaksi Baru"-->
<script lang="ts">
  import { goto } from "@roxi/routify";
  import { getTransactionContext, getAccountContext } from "__@modules/accounting";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Modal from "__@comps/Modal.svelte";
  import FormJournal from "./_forms/FormJournal.svelte";

  // context
  const { create, getTransaction } = getTransactionContext();
  const { accountStore } = getAccountContext();
  const { authenticationStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();

  // form
  let transaction = {
    date: new Date(),
    type: "JOURNAL",
    total: 0,
    accounts: [{}],
    userId: $authenticationStore.profile.id
  };

  // handler
  async function submitHandler({ detail: values }) {
    $loading = true;
    try {
      await create(values);
      $goto("./");
      notify("transaksi berhasil disimpan", "success");
      $loading = false;
    } catch (e) {
      $loading = false;
      notify(e.message, "error");
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<Modal title="Transaksi Baru" class="modal-lg">
  <div class="d-flex flex-column flex-1">
    <FormJournal values={transaction} loading={$loading} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</Modal>
