<!--routify:options title="form"-->
<script lang="ts">
  import { get } from "svelte/store";
  import { url, params, goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAccountContext } from "__@modules/accounting";
  import FormAccount from "./_forms/FormAccount.svelte";

  const { notify } = getApplicationContext();

  const { accountStore, create, update, accountTypeStore, getAccountType, getAccount } = getAccountContext();
  let isUpdate: boolean = false;
  let initial = {};
  let account: Account = {};
  let loading: boolean = false;
  $: {
    if ($params.id) {
      account = get(getAccount({ id: $params.id }));
      account && (isUpdate = true);
    }
  }

  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      if (isUpdate) {
        await update($params.id, values);
      } else {
        await create(values);
      }
      loading = false;
      $goto("./");
    } catch (e) {
      console.log(e);
      loading = false;
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{ title: 'Form Akun perkiraan', path: $url('./form') }}>
  <div class="d-flex flex-column h-100">
    <FormAccount values={{ ...initial, ...account }} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</PageLayout>
