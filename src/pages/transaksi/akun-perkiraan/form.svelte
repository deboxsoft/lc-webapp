<!--routify:options title="form"-->
<script lang="ts">
  import { url, params, goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import FormAccount from "./_forms/FormAccount.svelte";

  const { notify } = getApplicationContext();

  const {
    accountStore,
    createAccount,
    updateAccount,
    accountTypeStore,
    getAccountType,
    getAccount
  } = getAccountContext();
  let isUpdate: boolean = false;
  let initial = {};
  let account = getAccount($params.id);
  let loading: boolean = false;

  $: {
    if ($params.id && $account) {
      isUpdate = true;
    }
  }

  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      if (isUpdate) {
        await updateAccount($params.id, values);
      } else {
        await createAccount(values);
      }
      loading = false;
      $goto("./");
    } catch (e) {
      loading = false;
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{ title: 'Form Akun perkiraan', path: $url('./form') }}>
  <div class="d-flex flex-column h-100">
    <FormAccount values={{...initial, ...$account}} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</PageLayout>
