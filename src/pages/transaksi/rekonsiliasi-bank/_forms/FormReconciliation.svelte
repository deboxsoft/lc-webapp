<script lang="ts">
  import type { Account } from "@deboxsoft/accounting-api";
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import { getReconciliationContext } from "__@modules/accounting";
  import DatePickr from "__@comps/DatePickr.svelte";
  import InputRp from "__@comps/InputRp.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import AccountSelect from "../../../../components/account/AccountSelect.svelte";

  const { bankReconciliationStore } = getReconciliationContext();

  // props
  export let accountTransactionEnable: boolean = false;
  export let account: Account | undefined = undefined;
  export let formStore: FormStore;

  // state
  const fieldTransactionTypeStore = formStore?.getFieldStore("type");
  let formEl: HTMLFormElement;

  function accountSelectedHandler(e) {
  }
</script>

<Form bind:formStore bind:ref={formEl}>
  <div class="form-group">
    <label for="bank">Nama Bank</label>
    <InputField id="bank" name="bank" type="text" class="form-control" placeholder="Nama Bank" />
  </div>
  <div class="form-group">
    <label for="accountBank">No Akun Bank</label>
    <InputField id="accountBank" name="accountBank" type="text" class="form-control" placeholder="Akun Bank" />
  </div>
  <div class="form-group">
    <label for="nameAccountBank">Nama Akun Bank</label>
    <InputField
      id="nameAccountBank"
      name="nameAccountBank"
      type="text"
      class="form-control"
      placeholder="Nama Akun Bank" />
  </div>
  <div class="form-group">
    <label for="account">Akun</label>
    <AccountSelect on:change={accountSelectedHandler} />
  </div>
  <div class="row">
    <div class="form-group col-md-6">
      <label for="amount">Saldo Terakhir</label>
      <InputRp
        id="amount"
        class="form-control"
        name="amount"
        signed={false} />
    </div>
    <div class="form-group col-md-6">
      <label for="date">Tanggal</label>
      <DatePickr id="date" name="date" class="form-control" placeholder="Tanggal" />
    </div>
  </div>
</Form>
