<script lang="ts">
  import type { TransactionInput } from "@deboxsoft/accounting-api";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import { utils } from "@deboxsoft/module-core";
  import { TransactionInputSchema } from "@deboxsoft/accounting-api";
  import SaveIcon from "__@comps/icons/Save.svelte";
  import { getTransactionContext, getAccountContext } from "__@modules/accounting";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import FormJournalAccount from "./FormJournalAccount.svelte";

  const { getTransactionType, transactionTypeStore } = getTransactionContext();
  const { getAccountLeaf } = getAccountContext();
  const dispatch = createEventDispatcher();
  // props
  export let values: Partial<TransactionInput> = {};
  export let loading: boolean = false;
  export let title: string;

  let isValid = writable(false);

  // handler
  function createUpdateAmountHandler() {
    return utils.debounce((e) => {
      // debit = e.detail;
    });
  }

  function cancelHandler() {
    dispatch("cancel", values);
  }

</script>

<Form checkValidateFirst schema={TransactionInputSchema} {isValid} bind:values on:submit>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-md-6">
          <label for="date">Tanggal</label>
          <InputDate id="date" name="date" class="form-control" placeholder="Tanggal" value={new Date()} disabled />
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
          <AccountSelect id="accountId" accountStore={getAccountLeaf()} allowEmpty />
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