<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import Flatpickr from "flatpickr";
  import { createEventDispatcher } from "svelte";
  import { getTransactionContext } from "__@modules/transaksi";
  import DatePickr from "__@comps/DatePickr.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";

  const { getTransactionType, transactionTypeStore } = getTransactionContext();

  // props
  export let accountTransactionEnable: boolean = false;
  export let account: Account | undefined = undefined;
  export let formStore: FormStore;


  // state
  const fieldTransactionTypeStore = formStore?.getFieldStore("type");
  let formEl: HTMLFormElement;

  function transactionTypeHandler(e) {
    formStore?.setValue("type", e.detail.value);
  }
</script>

<Form bind:formStore bind:ref={formEl}>
  <div class="row">
    <div class="form-group col-md-6 col-xl-3">
      <label for="date">Tanggal</label>
      <DatePickr id="date" name="date" class="form-control" placeholder="Tanggal" />
    </div>
    <div class="form-group col-md-6 col-xl-3">
      <div style="margin-bottom: 0.5rem;">Jenis Transaksi</div>
      <AutoComplete
        id="transaction-type"
        name="type"
        on:change={transactionTypeHandler}
        inputClassName="form-control"
        selectedItem={getTransactionType($fieldTransactionTypeStore.value)}
        items={$transactionTypeStore}
        placeholder="jenis transaksi"
        value=""
        valueFunction={(val) => {
          return val;
        }} />
    </div>
    <div class="form-group col-md-6 col-xl-3">
      <label for="no">No</label>
      <InputField id="no" name="noJournal" type="text" class="form-control" placeholder="No" />
    </div>
    <div class="form-group col-md-6 col-xl-3">
      <label for="no-transaction">No Transaksi</label>
      <InputField
        id="no-transaction"
        name="noTransaction"
        type="text"
        class="form-control"
        placeholder="No Transaksi" />
    </div>
  </div>
  <div class="row" />
  <div class="form-group">
    <label for="description">Diskripsi</label>
    <InputField id="no-description" name="description" type="text" class="form-control" placeholder="Diskripsi" />
  </div>
</Form>
