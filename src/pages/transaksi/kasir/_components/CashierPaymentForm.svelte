<script>
  import { writable } from "svelte/store";
  import FormJournalAccountItem from "../../jurnal/_forms/FormJournalAccountItem.svelte";
  import { getFormContext } from "__@stores/form";
  import { filteringAccountRevenue } from "__@root/utils";
  import { stores } from "@deboxsoft/accounting-client";

  export let createCreditAccount;
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const creditFieldName = "creditAccounts";
  const creditAccountsValidate = validateField(creditFieldName);
  const creditAccounts = writable(($fields[creditFieldName] || []).map((_) => ({ ..._, ...createCreditAccount() })));
  const accounts = getAccountLeaf();
  const accountStore = filteringAccountRevenue(accounts);
  $: {
    if ($creditAccounts) {
      validate();
    }
  }

  function validate() {
    creditAccountsValidate($creditAccounts);
    if (Array.isArray($creditAccounts)) {
      let amount = 0;
      $creditAccounts.forEach((_) => {
        amount += _.amount || 0;
      });
      $fields.amount = amount;
    }
  }

  function addItemHandler() {
    $creditAccounts = [...$creditAccounts, createCreditAccount()];
  }

  function updateItemHandler(input) {
    const _creditAccounts = $creditAccounts;
    const i = _creditAccounts.findIndex((_) => _.index === input.index);
    _creditAccounts[i] = input;
    $creditAccounts = _creditAccounts;
  }

  function removeItemHandler(index) {
    /** @type{Array} **/
    let _creditAccounts = $creditAccounts;
    _creditAccounts = _creditAccounts.splice(index, 1);
    $creditAccounts = _creditAccounts;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th>Akun Kredit</th>
          <th class="text-center" width="275">Nominal</th>
          <th class="text-center" width="40" />
        </tr>
      </thead>
      <tbody>
        {#each $creditAccounts as creditAccountInput, index (creditAccountInput.index)}
          <FormJournalAccountItem
            {index}
            fieldName={creditFieldName}
            values={creditAccountInput}
            onRemoveJournalAccount={removeItemHandler}
            onUpdateJournalAccount={updateItemHandler}
            {accountStore}
          />
        {/each}
      </tbody>
    </table>
  </div>
</div>
