<script>
  import { getFormContext } from "__@stores/form";
  import { writable } from "svelte/store";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { convertToNumber } from "__@root/utils";
  import FormJournalAccountItem from "./FormJournalAccountItem.svelte";

  export let createCreditAccount;
  // context formJournal
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const oppositeAccountsValidate = validateField("oppositeAccounts");
  const oppositeAccounts = writable(($fields.oppositeAccounts || []).map((_) => ({ ..._, ...createCreditAccount() })));
  export const total = 0;
  export let isCredit = fields;

  let debit, labelMainAccount, labelOppositeAccount;
  let diff = NaN;
  let credit;

  $: {
    if ($oppositeAccounts) {
      validate();
    }
  }

  $: {
    if ($fields?.amount) {
      calculate();
    }
  }

  $: {
    if (!isCredit) {
      labelMainAccount = "Debit";
      labelOppositeAccount = "Kredit";
    } else {
      labelMainAccount = "Kredit";
      labelOppositeAccount = "Debit";
    }
  }

  function validate() {
    oppositeAccountsValidate($oppositeAccounts);
    calculate();
  }

  function calculate() {
    let _credit = 0;
    $fields.oppositeAccounts.forEach((_) => {
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
          <th>Akun {isCredit ? "Debit" : "Kredit"}</th>
          <th class="text-center" width="275">Nominal</th>
          <th class="text-center" width="40" />
        </tr>
      </thead>
      <tbody>
        {#each $oppositeAccounts as journalAccountInput, index (journalAccountInput.index)}
          <FormJournalAccountItem
            {index}
            {isCredit}
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
        <span class="flex-grow-1">Total {labelMainAccount}: Rp.</span>
        <span>{debit ? convertToNumber({ value: parseFloat(debit) }) : "-"}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Total {labelOppositeAccount}: Rp.</span>
        <span>{credit ? convertToNumber({ value: parseFloat(credit) }) : "-"}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1"> Selisih: Rp.</span>
        <span>{diff ? convertToNumber({ value: diff }) : "-"}</span>
      </div>
    </div>
  </div>
</div>
