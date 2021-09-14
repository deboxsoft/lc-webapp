<!--routify:options title="Posting Transaksi"-->
<script>
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";
  import FormJournal from "./_forms/FormJournal.svelte";

  // context
  const { create, getTransaction } = stores.getTransactionContext();
  const { createGranted } = getAclContext();
  const { accountStore } = stores.getAccountContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();
  const { authenticationStore } = getAuthenticationContext();
  const { notify, loading } = getApplicationContext();

  if (!createGranted) {
    $goto("/access-denied");
  }

  // form
  let openDialog, createCreditAccount, transaction, startUp = true;

  $: {
    if (startUp && $authenticationStore && !transaction && createCreditAccount) {
      init();
    }
  }

  function init() {
    startUp = false;
    getCurrentDate().then(date => {
      transaction = {
        date,
        type: "JOURNAL",
        creditAccounts: [createCreditAccount()],
        userId: $authenticationStore.profile.id
      }
    })
  }

  // handler
  async function submitHandler({ detail: values }) {
    $loading = true;
    try {
      await create(values);
      notify("transaksi berhasil disimpan", "success");
      $loading = false;
      cancelHandler();
    } catch (e) {
      $loading = false;
      notify(e.message, "error");
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<FormJournal title="Transaksi Baru" values={transaction} loading={$loading} on:submit={submitHandler} on:cancel={cancelHandler} bind:createCreditAccount />
