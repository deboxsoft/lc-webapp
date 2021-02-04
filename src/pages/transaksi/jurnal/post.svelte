<!--routify:options title="form"-->
<script lang="ts">
  import type { Account, JournalAccount, JournalAccountInput, Transaction } from "@deboxsoft/accounting-api";
  import type { FieldState } from "@deboxsoft/svelte-forms";

  import * as yup from "yup";
  import { url, params, ready, goto } from "@roxi/routify";
  import { input } from "sucrase/dist/parser/traverser/base";
  import { derived, writable } from "svelte/store";
  import { FormStore } from "@deboxsoft/svelte-forms";
  import { getBreadcrumbStore, BREADCRUMB_CONTEXT } from "__@stores/breadcrumb";
  import { getTransactionContext, getAccountContext } from "__@modules/transaksi";
  import { convertToRp } from "__@root/utils";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import JournalForm from "./_forms/JournalForm.svelte";
  import JournalAccountForm from "./_forms/JournalAccountForm.svelte";
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
    formStore.addField("accounts");
    formStore.addField("total");
  }
  let formEl: HTMLFormElement;

  // state
  let loading: boolean = false;
  const journalAccountsInput = writable<Partial<JournalAccountInput>[]>([{ amount: 0 }, { isCredit: true, amount: 0 }]);
  // handler
  function saveHandler() {
    loading = true;
    formStore.submit(async (values) => {
      try {
        if ($params.id) {
          await updateTransaction($params.id, values);
        } else {
          console.log(values);
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
        <JournalForm bind:formStore />
      </div>
      <div class="card-footer d-flex">
        <div class="flex-grow-1">&nbsp;</div>
        <div>
          <button class="btn btn-outline bg-pink-400 text-pink-400 border-pink-400" on:click={cancelHandler}>
            Cancel
          </button>
          <button class="btn btn-primary ml-1" on:click={saveHandler} disabled={loading}>
            <SaveIcon class="mr-2" />
            Save
          </button>
        </div>
      </div>
    </div>
    <JournalAccountForm {journalAccountsInput} {formStore} />
  </div>
</PageLayout>
