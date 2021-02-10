<!--routify:options title="form"-->
<script lang="ts">
  import { FormStore } from "@deboxsoft/svelte-forms";
  import { onMount } from "svelte";
  import { url, params, goto } from "@roxi/routify";
  import SaveIcon from "__@comps/icons/Save.svelte";
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
  let formStore: FormStore = new FormStore();
  let formEl: HTMLFormElement;
  let account;
  let loading: boolean = false;

  onMount(() => {
    formStore.addField("type");
  });

  $: {
    if ($params.id) {
      account = getAccount($params.id);
      if (formStore) {
        formStore.setValues($account);
      }
    }
  }

  function saveHandler(e) {
    formStore.submit(async (values: any) => {
      try {
        if ($account) {
          delete values.id;
          await updateAccount($account.id, values);
        } else {
          await createAccount(values);
        }
        $goto("./");
      } catch (e) {
        notify(e.message, "error");
        console.error(e);
      }
    });
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout breadcrumb={{ title: 'Form Akun perkiraan', path: $url('./') }}>
  <div class="d-flex flex-column h-100">
    <div class="card">
      <div class="card-body">
        <FormAccount bind:formStore />
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
