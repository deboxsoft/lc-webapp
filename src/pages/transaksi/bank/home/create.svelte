<!--routify:options title="Create Bank"-->
<script lang="ts">
  import type { Readable } from "svelte/store";

  import { url, goto, params } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getReconciliationContext } from "__@modules/accounting";
  import FormReconciliation from "./_components/FormBank.svelte";

  const { notify } = getApplicationContext();
  const { create, getBankReconciliation } = getReconciliationContext();

  let initial = {
    date: new Date(),
    bank: "",
    balance: "",
    accountBank: "",
    accountId: "",
    nameAccountBank: ""
  };
  let bankReconciliation: Readable<BankReconciliation>;
  let isUpdate: boolean = false;
  let loading: boolean = false;

  $: {
    if ($params.id) {
      bankReconciliation = getBankReconciliation($params.id);
      $bankReconciliation && (isUpdate = true);
    }
  }

  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      await create(values);
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

<PageLayout breadcrumb={{ title: 'Form Reconciliation Bank', path: $url('./form') }}>
  <div class="d-flex flex-column h-100">
    <FormReconciliation values={{ ...initial, ...$bankReconciliation }} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</PageLayout>
