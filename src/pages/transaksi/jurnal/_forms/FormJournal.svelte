<script lang="ts">
  import type { TransactionInput } from "@deboxsoft/accounting-api";
  import { TransactionInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import { debounce } from "@deboxsoft/module-core";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import SaveIcon from "__@comps/icons/Save.svelte";

  import { createEventDispatcher } from "svelte";
  import { derived, writable } from "svelte/store";
  import FormJournalAccount from "./FormJournalAccount.svelte";

  const { getTransactionType, transactionTypeStore } = stores.getTransactionContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const dispatch = createEventDispatcher();
  // props
  export let values: Partial<TransactionInput> = {};
  export let loading: boolean = false;
  export const title: string = "";

  let isValid = writable(false);
  let fieldsErrors;
  let fields

  function getAccountDebit () {
    const accountStore = getAccountLeaf();
    return derived(accountStore, (_) => {
      return _.filter((_) => /^[^4].*/g.test(_.id));
    })
  }

  // handler
  function createUpdateAmountHandler() {
    return debounce((e) => {
      // debit = e.detail;
    });
  }

  function cancelHandler() {
    dispatch("cancel", values);
  }

</script>

<Form checkValidateFirst schema={TransactionInputSchema} bind:fieldsErrors bind:fields {isValid} bind:values on:submit>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-md-6">
          <label for="date">Tanggal</label>
          <InputDate id="date" name="date" class="form-control" placeholder="Tanggal" value={new Date()} disabled={values.status === "UNAPPROVED"} />
        </div>
        <div class="form-group col-md-6">
          <label for="no">No Bukti/kwitansi</label>
          <InputField id="no" name="no" type="text" class="form-control" placeholder="No" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12">
          <label for="description">Diskripsi</label>
          <InputField id="description" name="description" type="text" class="form-control" placeholder="Diskripsi" />
        </div>
      </div>
      <div class="row">
        <!--        <div class="form-group col-md-6">-->
        <!--          <div style="margin-bottom: 0.5rem;">Jenis Transaksi</div>-->
        <!--          <AutoComplete-->
        <!--            id="transaction-type"-->
        <!--            name="type"-->
        <!--            inputClassName="form-control"-->
        <!--            pristineValue={values.type || 'JOURNAL'}-->
        <!--            items={$transactionTypeStore}-->
        <!--            placeholder="jenis transaksi"-->
        <!--            valueFieldName="code"-->
        <!--            keywordsFieldName="name"-->
        <!--            labelFieldName="name" />-->
        <!--        </div>-->
        <div class="form-group col-md-6">
          <label for="accountId">Debit</label>
<!--            <AccountCombox id="accountId" accountStore={getAccountLeaf()} allowEmpty />-->
          <AccountSelect id="accountId" accountStore={getAccountDebit()} allowEmpty />
        </div>
        <div class="form-group col-md-6">
          <label for="amount">Jumlah</label>
          <InputRp id="amount" class="form-control" name="amount" signed on:input={createUpdateAmountHandler()} />
        </div>
      </div>
    </div>
    <div class="card-footer d-flex">
      <div class="flex-grow-1">&nbsp;</div>
      <div>
        <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={cancelHandler}>
          Cancel
        </button>
        <button type="submit" class="btn btn-primary ml-1" disabled={!$isValid || loading}>
          <SaveIcon class="mr-2" disable={loading} />
          Save
        </button>
      </div>
    </div>
  </div>
  <FormJournalAccount />
</Form>