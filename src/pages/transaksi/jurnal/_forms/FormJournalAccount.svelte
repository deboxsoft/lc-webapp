<script>
  import { getFormContext} from "../../../../stores/form";
  import { writable } from "svelte/store";
  import ListPlusIcon from "../../../../components/icons/ListPlus.svelte";
  import CheckIcon from "../../../../components/icons/Check.svelte";
  import CloseIcon from "../../../../components/icons/Close.svelte";
  import { convertToNumber } from "../../../../utils";
  import FormJournalAccountItem from "./FormJournalAccountItem.svelte";

  // context formJournal
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const creditAccountsValidate = validateField("creditAccounts");

  export let createCreditAccount;
  export const total = 0;

  let debit;
  let diff = NaN;
  let creditAccounts = writable(($fields.creditAccounts || []).map((_) => ({ ..._, ...createCreditAccount() })));
  let credit;

  $: {
    if ($creditAccounts) {
      validate();
    }
  }

  $: {
    if ($fields?.amount) {
      calculate();
    }
  }

  function validate() {
    creditAccountsValidate($creditAccounts);
    validateField("creditAccounts");
    calculate();
  }

  function calculate() {
    let _credit = 0;
    $creditAccounts.forEach((_) => {
      _credit = parseFloat(_.amount || "0") + _credit;
    });
    $fields.total = _credit;
    credit = _credit;
    debit = $fields.amount;
    diff = ($fields.amount || 0) - credit;
    if ($fields.total === 0 || $fields.total !== $fields.amount) {
      $fieldsErrors = { ...$fieldsErrors, noBalance: "debit and credit not balance" };
    } else {
      delete $fieldsErrors.noBalance;
      delete $fieldsErrors["total"];
    }
    isValid.set(Object.keys($fieldsErrors).length === 0);
  }

  function accountsValidate() {
    if ($fieldsErrors?.creditAccounts && Object.keys($fieldsErrors.creditAccounts).length === 0) {
      delete $fieldsErrors.creditAccounts;
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
          <th>Akun Kredit</th>
          <th class="text-center" style="width: 275px">Jumlah</th>
          <th class="text-center" style="width: 40px" />
        </tr>
      </thead>
      <tbody>
        {#each $creditAccounts as journalAccountInput, index (journalAccountInput.index)}
          <FormJournalAccountItem
            {index}
            values={journalAccountInput}
            onRemoveJournalAccount={removeJournalAccountHandler}
            onUpdateJournalAccount={updateJournalAccountHandler}
          />
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button type="button" class="btn btn-light" on:click={addJournalAccountHandler}>
        <ListPlusIcon class="mr-2" />
        Tambah Akun
      </button>
    </div>
    {#if debit > 0 || credit > 0}
      {#if diff === 0}
        <div class="text-success" style="width: 30px;">
          <CheckIcon />
        </div>
      {:else}
        <div class="text-danger" style="width: 30px;">
          <CloseIcon />
        </div>
      {/if}
    {/if}
    <div class="d-flex flex-column" style="width: 250px">
      <div class="d-flex">
        <span class="flex-grow-1">Total Debit: Rp.</span>
        <span>{debit ? convertToNumber({ value: parseFloat(debit) }) : "-"}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Total Kredit: Rp.</span>
        <span>{credit ? convertToNumber({ value: parseFloat(credit) }) : "-"}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1"> Selisih: Rp.</span>
        <span>{diff ? convertToNumber({ value: diff }) : "-"}</span>
      </div>
    </div>
  </div>
</div>
