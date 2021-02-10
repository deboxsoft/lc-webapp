<!--routify:options title="form"-->
<script lang="ts">
  import type { JournalAccountInput, Transaction } from "@deboxsoft/accounting-api";
  import type { FieldState } from "@deboxsoft/svelte-forms";

  import * as yup from "yup";
  import { url, params, goto } from "@roxi/routify";
  import { FormStore } from "@deboxsoft/svelte-forms";
  import { getBreadcrumbStore} from "__@stores/breadcrumb";
  import { getTransactionContext, getAccountContext } from "__@modules/accounting";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import FormJournal from "./_forms/FormJournal.svelte";
  import FormJournalAccount from "./_forms/FormJournalAccount.svelte";
  // icons
  import SaveIcon from "__@comps/icons/Save.svelte";

  const { setBreadcrumb } = getBreadcrumbStore();
  setBreadcrumb({ path: $url("./"), title: "posting jurnal" });
  const { accountStore } = getAccountContext();

  // validation
  const validation: Partial<Record<keyof Transaction, any>> = {
    noJournal: (value) => yup.string().required().validate(value),
    accounts: (value) => {}
  };

  // form
  let isUpdate: boolean = false;
  let formStore: FormStore = new FormStore();
  let journalAccounts: JournalAccountInput[];
  let total: number = 0;

  // context
  const { createTransaction, updateTransaction, findTransactionById } = getTransactionContext();
  if ($params.id) {
    findTransactionById($params.id).then((transaction) => {
      if (transaction) {
        isUpdate = true;
        const initial: Record<keyof Transaction, FieldState> | {} = {};
        Object.keys(transaction).forEach((key: keyof Transaction) => {
          initial[key] = { value: transaction[key], validate: validation[key] };
        });
        formStore.resetForm({ initial });
      }
    });
  } else {
    formStore.addField("type", { value: "JOURNAL" });
    formStore.addField("accounts", { value: [{}] });
    formStore.addField("total");
  }

  let formEl: HTMLFormElement;
  // state
  let loading: boolean = false;
  // handler
  function saveHandler() {
    loading = true;
    formStore.setValue("accounts", journalAccounts);
    formStore.setValue("total", total);
    formStore.submit(async (values) => {
      try {
        if ($params.id) {
          await updateTransaction($params.id, values);
        } else {
          await createTransaction(values);
        }
        loading = false;
        $goto("./");
      } catch (e) {
        console.error(e);
        loading = false;
      }
    });
  }

  function cancelHandler() {
    $goto("./");
  }
</script>

<PageLayout>
  <div class="header-elements" slot="header-elements">
    <!--    <a href={$url('./')} class="btn btn-link btn-float text-default" target="_self">-->
    <!--      <Icon class="text-primary" size="large" component={SaveIcon} />-->
    <!--    </a>-->
  </div>
  <div class="d-flex flex-column h-100">
    <div class="card">
      <div class="card-body">
        <FormJournal bind:formStore />
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
    <FormJournalAccount bind:journalAccounts bind:total/>
  </div>
</PageLayout>
