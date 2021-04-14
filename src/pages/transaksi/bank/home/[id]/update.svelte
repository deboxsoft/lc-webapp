<!--routify:options title="Update Bank"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import FormReconciliation from "../_components/FormBank.svelte";

  const { notify } = getApplicationContext();
  const { bankId, update, bankReconciliation } = getStoreContext();

  let loading: boolean = false;

  async function submitHandler({ detail: values }) {
    loading = true;
    try {
      await update(bankId, values);
      loading = false;
      $goto("../");
    } catch (e) {
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
