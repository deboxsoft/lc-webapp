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
    if ($oppositeAccounts) {
      validate();
    }
  }

  function validate() {
    oppositeAccountsValidate($oppositeAccounts);
    if (Array.isArray($oppositeAccounts)) {
      let amount = 0;
      $oppositeAccounts.forEach((_) => {
        amount += _.amount || 0;
      });
      $fields.amount = amount;
    }
  }

  function addJournalAccountHandler() {
    $oppositeAccounts = [...$oppositeAccounts, createCreditAccount()];
  }

  function updateJournalAccountHandler(input) {
    const _oppositeAccounts = $oppositeAccounts;
    const i = _oppositeAccounts.findIndex((_) => _.index === input.index);
    _oppositeAccounts[i] = input;
    $oppositeAccounts = _oppositeAccounts;
  }

  function removeJournalAccountHandler(index) {
    /** @type{Array} **/
    let _oppositeAccounts = $oppositeAccounts;
    _oppositeAccounts = _oppositeAccounts.splice(index, 1);
    $oppositeAccounts = _oppositeAccounts;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th>Pembayaran</th>
          <th class="text-center" width="275">Nominal</th>
          <th class="text-center" width="40" />
        </tr>
      </thead>
      <tbody>
        {#each $oppositeAccounts as creditAccountInput, index (creditAccountInput.index)}
          <FormJournalAccountItem
            {index}
            values={creditAccountInput}
            onRemoveJournalAccount={removeJournalAccountHandler}
            onUpdateJournalAccount={updateJournalAccountHandler}
          />
        {/each}
      </tbody>
    </table>
  </div>
</div>
