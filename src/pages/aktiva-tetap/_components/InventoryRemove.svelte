<script>
  import { stores } from "@deboxsoft/accounting-client";
  import CellNumber from "__@comps/CellNumber.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { filteringAccountCredit, filteringAccountDebit } from "__@root/utils";

  const { getCategoryInventory } = stores.getInventoryContext();
  const { getAccountLeaf } = stores.getAccountContext();

  export let inventory;
  export let schema;
  export let isValid;
  export let fields;
  export let values;
  const depreciationList = inventory.logs || [];
  const totalDepreciation = depreciationList.reduce((tot, depreciation) => tot + depreciation.amount, 0);

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "debit": {
        return filteringAccountDebit(accountStore);
      }
      case "credit": {
        return filteringAccountCredit(accountStore);
      }
    }
  }
</script>

<Form checkValidateFirst {schema} bind:values bind:fields bind:isValid>
  <dl class="row">
    <dt class="col-sm-5">Nama</dt>
    <p class="col-sm-7">
      : {inventory.name || "-"}
    </p>
    <dt class="col-sm-5">Total Akumulasi Depresiasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<CellNumber value={totalDepreciation} />
    </p>
  </dl>
  <div class="row">
    <div class="form-group col-12">
      <label for="debitAccount">Akun Debit</label>
      <AccountSelect
        id="debitAccount"
        name="debitAccount"
        accountStore={getAccount("debit")}
        accountId={values?.debitAccount}
        placeholder="Akun Debit"
        allowEmpty
      />
    </div>
  </div>
  <div class="row">
    <div class="form-group col-12">
      <label for="creditAccount">Akun Kredit</label>
      <AccountSelect
        id="creditAccount"
        name="creditAccount"
        accountStore={getAccount("credit")}
        accountId={values?.creditAccount}
        placeholder="Akun Kredit"
        allowEmpty
      />
    </div>
  </div>
</Form>
