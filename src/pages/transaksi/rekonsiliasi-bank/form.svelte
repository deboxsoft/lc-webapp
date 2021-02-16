<!--routify:options title="form"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getReconciliationContext } from "__@modules/accounting";
  import FormReconciliation from "./_comps/FormReconciliation.svelte";

  const { notify } = getApplicationContext();
  const { createBankReconciliation, getReconciliation } = getReconciliationContext();

  let initial = {
    date: new Date(),
    bank: "",
    balance: "",
    accountBank: "",
    accountId: "",
    nameAccountBank: ""
  };
  let loading: boolean = false;

  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      await createBankReconciliation(values);
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
    <FormReconciliation fields={initial} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</PageLayout>
