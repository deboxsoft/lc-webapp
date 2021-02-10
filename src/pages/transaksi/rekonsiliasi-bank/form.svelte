<!--routify:options title="form"-->
<script lang="ts">
  import { FormStore } from "@deboxsoft/svelte-forms";
  import { onMount } from "svelte";
  import { url, params, goto } from "@roxi/routify";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import { getApplicationContext } from "__@modules/app";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import FormReconciliation from "./_forms/FormReconciliation.svelte";
  import { getReconciliationContext } from "__@modules/accounting";

  const { notify } = getApplicationContext();

  const { createBankReconciliation, updateBankReconciliation, getReconciliation } = getReconciliationContext();
  let formStore: FormStore = new FormStore();
  let formEl: HTMLFormElement;
  let reconciliationBank;
  let loading: boolean = false;

  onMount(() => {
    formStore.addField("type");
  });

  $: {
    if ($params.id) {
      reconciliationBank = getReconciliation($params.id);
      if (formStore) {
        formStore.setValues($reconciliationBank);
      }
    }
  }

  function saveHandler(e) {
    formStore.submit(async (values: any) => {
      try {
        if ($reconciliationBank) {
          delete values.id;
          await updateBankReconciliation($reconciliationBank.id, values);
        } else {
          await createBankReconciliation(values);
        }
        $goto("./");
      } catch (e) {
        console.error(e);
      }
    });
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{ title: 'Form Reconciliation Bank', path: $url('./') }}>
  <div class="d-flex flex-column h-100">
    <div class="card">
      <div class="card-body">
        <FormReconciliation {formStore} />
      </div>
      <div class="card-footer d-flex">
        <div class="flex-grow-1">&nbsp;</div>
        <div>
          <button class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
            Cancel
          </button>
          <button class="btn btn-primary ml-1" on:click={saveHandler} disabled={loading}>
            <SaveIcon class="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</PageLayout>
