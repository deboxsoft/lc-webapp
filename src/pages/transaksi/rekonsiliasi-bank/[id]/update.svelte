<!--routify:options title="form"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import {getStoreContext} from "./_store"
  import FormReconciliation from "../_comps/FormReconciliation.svelte";

  const { notify } = getApplicationContext();
  const { bankId, updateBankReconciliation, bankReconciliation } = getStoreContext();

  let loading: boolean = false;

  async function submitHandler({ detail: values }) {
    console.log("submit");
    loading = true;
    try {
      await updateBankReconciliation(bankId, values);
      loading = false;
      $goto("../");
    } catch (e) {
      console.log(e);
      loading = false;
    }
  }

  function cancelHandler() {
    $goto("../");
  }
</script>

<PageLayout breadcrumb={{ title: 'Form Update Reconciliation Bank', path: $url('./update') }}>
  <div class="d-flex flex-column h-100">
    <FormReconciliation values={$bankReconciliation} on:submit={submitHandler} on:cancel={cancelHandler} />
  </div>
</PageLayout>
