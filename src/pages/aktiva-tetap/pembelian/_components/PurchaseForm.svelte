<script>
  import { stores } from "@deboxsoft/accounting-client";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCash, filteringAccountInventory, filteringAccountExpense } from "__@root/utils";
  import PurchaseItems from "./PurchaseItems.svelte";

  const { getAccountLeaf } = stores.getAccountContext();

  // props
  export let inventoryTransaction;
  export let schema;
  export let isValid;
  export let fields;
  export let fieldsErrors = undefined;

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "inventory": {
        return filteringAccountInventory(accountStore);
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

<Form checkValidateFirst {schema} values={inventoryTransaction} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12 col-md-4">
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
        <div class="form-group col-12 col-md-4">
          <label for="code">No Nota</label>
          <InputField id="no" name="no" type="text" class="form-control" placeholder="No Nota" />
        </div>
        <div class="form-group col-12 col-md-4">
          <label for="supplier">Supplier</label>
          <InputField id="supplier" name="supplier" type="text" class="form-control" placeholder="Supplier" />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="description">Deskripsi</label>
          <InputField id="description" name="description" type="text" class="form-control" placeholder="Deskripsi" />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="debitAccount">Akun di Debit *</label>
          <AccountSelect
            id="inventoryAccount"
            name="inventoryAccount"
            accountId={inventoryTransaction?.inventoryAccount}
            placeholder="Akun Debit *"
            allowEmpty
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="creditAccount">Pembayaran *</label>
          <AccountSelect
            id="cashAccount"
            name="cashAccount"
            accountStore={getAccount("cash")}
            accountId={inventoryTransaction?.cashAccount}
            placeholder="Pembayaran *"
            allowEmpty
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="cashAmount">Jumlah Pembayaran *</label>
          <InputRp id="cashAmount" class="form-control" name="cashAmount" signed placeholder="Jumlah Pembayaran *" />
        </div>
      </div>
    </div>
  </div>
  {#if $fields}
    <PurchaseItems />
  {/if}
</Form>
