<script>
  import { createProgramContext } from "@deboxsoft/lc-cashier-client";
  import { stores as userStores } from "@deboxsoft/users-client";
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";

  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import CashierPaymentForm from "./CashierPaymentForm.svelte";
  import { tick } from "svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCash } from "__@root/utils";
  import { writable } from "svelte/store";

  const applicationContext = getApplicationContext();
  const { authenticationStore } = userStores.getAuthenticationContext();
  const { notify, loading } = applicationContext;
  const { getAccountLeaf, getAccountStore } = stores.getAccountContext();
  const { programStore, findPage: findProgramContext } = createProgramContext(applicationContext);
  const accounts = getAccountLeaf();
  const accountsDebitStore = filteringAccountCash(accounts);

  export function createCreditAccount() {
    return { index: generateId({ prefix: "account-input", size: 3 }) };
  }

  // props
  export let cashier;
  export let schema;
  export let isUpdate = false;
  export let fields;
  export let fieldsErrors;
  export let isValid;
  export let focusRef;

  let buttonSaveDisable;
  $: meta = $authenticationStore.metadata;

  $: {
    if (!$programStore) {
      findProgramContext({ pageCursor: {}, filter: {} }, {});
    }
  }

  $: {
    tick().then(() => {
      buttonSaveDisable = !$isValid || $loading;
    });
  }

  $: cashierAccount = $getAccountStore(meta.cashierAccount);
</script>

<Form checkValidateFirst {schema} values={cashier} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="date">Tanggal</label>
          <InputDate id="date" name="date" class="form-control" placeholder="Tanggal" range="" />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="name">No Bukti/kwitansi</label>
          <InputField id="no" name="no" type="text" class="form-control" placeholder="No Bukti/kwitansi" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="categoryId">Program</label>
          <ComboxField
            id="programId"
            name="programId"
            class="form-control"
            items={$programStore}
            valueId="id"
            labelId="name"
            placeHolder="Program"
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="student">Nama Siswa</label>
          <InputField id="student" name="student" class="form-control" placeholder="Nama Siswa" bind:ref={focusRef} />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="debitAccount">Akun Kas</label>
          <AccountSelect
            id="debitAccount"
            name="debitAccount"
            accountId={cashierAccount?.id}
            accountStore={meta.isCashier ? writable([cashierAccount]) : accountsDebitStore}
            disabled={meta.isCashier}
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="description">Keterangan</label>
          <InputField
            id="description"
            name="description"
            class="form-control"
            placeholder="Keterangan"
            bind:ref={focusRef}
          />
        </div>
      </div>
    </div>
  </div>
  {#if $fields}
    <CashierPaymentForm {createCreditAccount} />
  {/if}
</Form>
