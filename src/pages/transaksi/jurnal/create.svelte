<!--routify:options title="Posting Transaksi"-->
<script>
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";
  import FormJournal from "./_forms/FormJournal.svelte";

  // context
  const applicationContext = getApplicationContext();
  const { create, getTransaction } = stores.getTransactionContext();
  const { createGranted } = getAclContext();
  const { accountStore, getAccount } = stores.getAccountContext();
  const { authenticationStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();

  if (!createGranted) {
    $goto("/access-denied");
  }

  // form
  let openDialog,
    createCreditAccount,
    transaction,
    startUp = true,
    submitting = false;

  $: {
    if (startUp && $authenticationStore && !transaction && createCreditAccount) {
      init();
    }
  }

  function init() {
    startUp = false;
    transaction = {
      date: new Date(),
      type: "JOURNAL",
      oppositeAccounts: [createCreditAccount()],
      userId: $authenticationStore.profile.id
    };
  }

  // handler
  async function submitHandler({ detail: values }) {
    $loading = true;
    submitting = true;
    try {
      await create(values);
      notify("transaksi berhasil disimpan", "success");
      cancelHandler();
    } catch (e) {
      console.error(e);
      notify(e.message, "error");
    } finally {
      $loading = false;
      submitting = false;
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<FormJournal
  title="Transaksi Baru"
  values={transaction}
  loading={submitting}
  on:submit={submitHandler}
  on:cancel={cancelHandler}
  bind:createCreditAccount
/>
