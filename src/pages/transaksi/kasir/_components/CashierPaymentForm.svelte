<script>
  import { writable } from "svelte/store";
  import FormJournalAccountItem from "../../jurnal/_forms/FormJournalAccountItem.svelte";
  import { getFormContext } from "__@stores/form";

  export let createCreditAccount;
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const creditAccountsValidate = validateField("creditAccounts");
  const creditAccounts = writable(($fields.creditAccounts || []).map((_) => ({ ..._, ...createCreditAccount() })));

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

  function addJournalAccountHandler() {
    $creditAccounts = [...$creditAccounts, createCreditAccount()];
  }

  function updateJournalAccountHandler(input) {
    const _creditAccounts = $creditAccounts;
    const i = _creditAccounts.findIndex((_) => _.index === input.index);
    _creditAccounts[i] = input;
    $creditAccounts = _creditAccounts;
  }

  function removeJournalAccountHandler(index) {
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
          <th>Pembayaran</th>
          <th class="text-center" width="275">Nominal</th>
          <th class="text-center" width="40" />
        </tr>
      </thead>
      <tbody>
        {#each $creditAccounts as creditAccountInput, index (creditAccountInput.index)}
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
