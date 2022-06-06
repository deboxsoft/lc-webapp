<script>
  import { stores } from "@deboxsoft/accounting-client";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import PaymentForm from "__@comps/transactions/PaymentForm.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCash, filteringAccountStock, filteringAccountExpense } from "__@root/utils";
  import ItemListForm from "./ItemListForm.svelte";

  const { getAccountLeaf } = stores.getAccountContext();

  // props
  export let stockTransaction;
  export let schema;
  export let isUpdate = false;
  export let isValid;
  export let fields;
  let submitting = false,
    fieldsErrors,
    totalPayment;

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "stock": {
        return filteringAccountStock(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
      case "expense": {
        return filteringAccountExpense(accountStore);
      }
    }
  }
</script>

<Form checkValidateFirst {schema} values={stockTransaction} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      {#if stockTransaction.mutation === "STOCK_IN"}
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="date">Tanggal Pembelian *</label>
            <InputDate
              id="datePurchase"
              name="datePurchase"
              class="form-control"
              placeholder="Tanggal Pembelian *"
              range={false}
              yearEditable
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="code">No Nota</label>
            <InputField id="no" name="no" type="text" class="form-control" placeholder="No Nota" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="description">Deskripsi *</label>
            <InputField
              id="description"
              name="description"
              type="text"
              class="form-control"
              placeholder="Deskripsi *"
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="stockAccount">Akun Persediaan *</label>
            <AccountSelect
              id="stockAccount"
              name="stockAccount"
              accountStore={getAccount("stock")}
              accountId={stockTransaction?.stockAccount}
              placeholder="Akun Persediaan *"
              allowEmpty
            />
          </div>
        </div>
      {:else}
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="date">Tanggal</label>
            <InputDate id="date" name="date" class="form-control" placeholder="Tanggal" range={false} disabled />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="description`">Deskripsi</label>
            <InputField
              id="description`"
              name="description`"
              type="text"
              class="form-control"
              placeholder="Deskripsi"
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="expenseAccount">Akun Biaya</label>
            <AccountSelect
              id="expenseAccount"
              name="expenseAccount"
              accountStore={getAccount("expense")}
              accountId={stockTransaction?.expenseAccount}
              placeholder="Akun Biaya"
              allowEmpty
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="stockAccount">Akun di Kredit</label>
            <AccountSelect
              id="stockAccount"
              name="stockAccount"
              accountStore={getAccount("stock")}
              accountId={stockTransaction?.stockAccount}
              placeholder="Akun di Kredit"
              allowEmpty
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
  {#if $fields}
    {#if stockTransaction.mutation === "STOCK_IN"}
      <PaymentForm bind:totalPayment />
    {/if}
    <ItemListForm {totalPayment} />
  {/if}
</Form>
