<script>
  import { writable } from "svelte/store";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputField from "__@comps/forms/InputField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import {
    filteringAccountBdd,
    filteringAccountCash,
    filteringAccountAccumulationAmortization,
    filteringAccountExpenseAmortization,
    convertToNumber
  } from "__@root/utils";
  import PaymentForm from "__@comps/transactions/PaymentForm.svelte";

  const { getAccountLeaf } = stores.getAccountContext();

  const { notify, loading } = getApplicationContext();
  const { getAmortization, amortizationStore } = stores.getBddContext();

  // props
  export let bdd;
  export let schema = undefined;
  export let fields = writable(undefined);
  let fieldsErrors = undefined,
    totalPayment;
  export let isValid = writable(false);

  $: taxValue = $fields?.taxRate ? (parseFloat($fields.taxRate) * parseFloat(totalPayment || "0")) / 100 : 0;

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "bdd": {
        return filteringAccountBdd(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
      case "expense": {
        return filteringAccountExpenseAmortization(accountStore);
      }
      case "accumulation": {
        return filteringAccountAccumulationAmortization(accountStore);
      }
      default: {
        return accountStore;
      }
    }
  }
</script>

<Form checkValidateFirst {schema} values={{ ...bdd }} bind:fields bind:fieldsErrors bind:isValid on:submit>
  <div class="card flex-grow-1">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="dateStart">Tanggal Perolehan *</label>
          <InputDateField
            id="dateStart"
            name="dateStart"
            class="form-control"
            placeholder="Tanggal Perolehan *"
            range={false}
            yearEditable
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="monthLife">Umur (Bulan) *</label>
          <InputNumberField
            format="number"
            id="monthLife"
            name="monthLife"
            class="form-control"
            placeholder="Jangka Waktu (Bulan) *"
            maximumValue="10000"
            minimumValue="0"
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-4">
          <label for="bddAccount">Akun BDD *</label>
          <AccountSelect
            accountStore={getAccount("bdd")}
            id="bddAccount"
            name="bddAccount"
            placeholder="Akun BDD *"
            allowEmpty
          />
        </div>
        <div class="form-group col-4">
          <label for="expenseAccount">Akun Biaya Amortisasi *</label>
          <AccountSelect
            accountStore={getAccount("expense")}
            accountId={bdd?.expenseAccount}
            id="expenseAccount"
            name="expenseAccount"
            placeholder="Akun Biaya Amortisasi *"
            allowEmpty
          />
        </div>
        <div class="form-group col-4">
          <label for="amortizationAccount">Akun Akumulasi BDD *</label>
          <AccountSelect
            accountStore={getAccount("accumulation")}
            accountId={bdd?.amortizationAccount}
            id="amortizationAccount"
            name="amortizationAccount"
            placeholder="Akun Akumulasi BDD *"
            allowEmpty
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-8">
          <label for="description">Nama *</label>
          <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama *" />
        </div>
        <div class="form-group col-4">
          <label for="category">Jenis</label>
          <InputField id="category" name="category" type="text" class="form-control" placeholder="Jenis" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="taxAccount" class="font-weight-bold">Pajak</label>
          <AccountSelect
            accountStore={getAccount("tax")}
            id="taxAccount"
            name="taxAccount"
            placeholder="Akun Pajak"
            allowEmpty
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="taxRate">&nbsp;</label>
          <InputNumberField
            format="number"
            id="taxRate"
            name="taxRate"
            class="form-control"
            placeholder="Pajak (%)"
            maximumValue="100"
            minimumValue="0"
            decimalEnable
          />
        </div>
      </div>
    </div>
  </div>
  {#if $fields}
    <PaymentForm bind:totalPayment>
      <svelte:fragment slot="footer-right">
        <div class="d-flex">
          <span class="flex-grow-1">Pajak: Rp.</span>
          <span>{$fields?.taxRate ? convertToNumber({ value: taxValue }) : "-"}</span>
        </div>
        <div class="d-flex" style="border-top: solid 1px gray">
          <span class="flex-grow-1 color-red"> Total: Rp.</span>
          <span>{totalPayment ? convertToNumber({ value: totalPayment + taxValue }) : "-"}</span>
        </div>
      </svelte:fragment>
    </PaymentForm>
  {/if}
</Form>
