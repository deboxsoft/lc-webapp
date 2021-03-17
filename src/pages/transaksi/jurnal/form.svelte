<!--routify:options title="form"-->
<script lang="ts">
  import { url, params, goto } from "@roxi/routify";
  import { getTransactionContext, getAccountContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import FormJournal from "./_forms/FormJournal.svelte";

  // context
  const { create, update, getTransaction, transactionStore } = getTransactionContext();
  const { accountStore } = getAccountContext();

  // form
  let initial = {
    date: new Date(),
    type: "JOURNAL",
    accounts: [{}]
  };
  let transaction = getTransaction($params.id);
  let loading: boolean = false;
  let isUpdate: boolean = false;

  $: {
    if ($params.id && transaction) {
      isUpdate = true;
    }
  }

  // handler
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
      loading = false;
    }
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{path: $url("./form"), title: "form jurnal"}}>
  <div class="header-elements" slot="header-elements">
    <!--    <a href={$url('./')} class="btn btn-link btn-float text-default" target="_self">-->
    <!--      <Icon class="text-primary" size="large" component={SaveIcon} />-->
    <!--    </a>-->
  </div>
  <div class="d-flex flex-column h-100">
    <FormJournal
      values={{ ...initial, ...$transaction }}
      {loading}
      on:submit={submitHandler}
      on:cancel={cancelHandler} />
  </div>
</PageLayout>
