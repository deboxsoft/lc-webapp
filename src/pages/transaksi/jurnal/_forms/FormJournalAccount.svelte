<script lang="ts">
  import type { JournalAccountInput } from "@deboxsoft/accounting-api";

  import { getFormContext, createFormContext } from "__@stores/form";
  import { writable } from "svelte/store";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { convertToRp } from "__@root/utils";
  import JournalAccountItemForm from "./FormJournalAccountItem.svelte";

  // context formJournal
  const { schema, fields, fieldsErrors, isValid, validateField } = getFormContext();
  const accountsValidate = validateField("accounts");
  const journalAccountSchema = schema.pick({ accounts: true });
  createFormContext({ schema: journalAccountSchema });

  const createJournalAccount = () => ({ index: getId({ prefix: "account-input", size: 3 }) });

  export let total: number = 0;

  let debit: any;
  let diff: number = NaN;
  let journalAccountsStore = writable($fields.accounts.map((_) => ({ ..._, ...createJournalAccount() })));
  let credit: any;

  // validation form journal
  // hack hapus FieldsError.account
  delete $fieldsErrors["accounts"];
  $: {
    let _credit = 0;
    $journalAccountsStore.forEach((_) => {
      _credit = parseFloat(_.amount || 0) + _credit;
    });
    $fields.total = _credit;
    credit = _credit;
    debit = $fields.amount;
    diff = ($fields.amount || 0) - _credit;
    if ($fields.total === 0 || $fields.total !== $fields.amount) {
      $fieldsErrors = { ...$fieldsErrors, noBalance: "debit and credit not balance" };
    } else {
      delete $fieldsErrors.noBalance;
      delete $fieldsErrors["total"];
    }
    isValid.set(Object.keys($fieldsErrors).length === 0);
  }

  function addJournalAccountHandler() {
    $journalAccountsStore = [...$journalAccountsStore, createJournalAccount()];
    $fields.accounts = $journalAccountsStore;
    accountsValidate($journalAccountsStore);
  }

  function updateJournalAccountHandler(input: JournalAccountInput) {
    const i = $journalAccountsStore.findIndex((_) => _.index === input.index);
    $journalAccountsStore[i] = input;
    $fields.accounts = $journalAccountsStore;
    accountsValidate($journalAccountsStore);
  }

  function removeJournalAccountHandler(index: number) {
    let inputs = $journalAccountsStore;
    inputs = inputs.filter((_) => _.index !== index);
    $journalAccountsStore = inputs;
    $fields.accounts = $journalAccountsStore;
    accountsValidate($journalAccountsStore);
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th class="text-center" style="width: 20px">#</th>
          <th>Akun Kredit</th>
          <th class="text-center" style="width: 275px">Jumlah</th>
          <th class="text-center" style="width: 20px">#</th>
        </tr>
      </thead>
      <tbody>
        {#each $journalAccountsStore as journalAccountInput, index (journalAccountInput.index)}
          <JournalAccountItemForm
            {index}
            input={journalAccountInput}
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
        <span>{debit ? convertToRp(parseFloat(debit)) : "-"}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Total Kredit: Rp.</span>
        <span>{credit ? convertToRp(parseFloat(credit)) : "-"}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1"> Selisih: Rp.</span>
        <span>{diff ? convertToRp(diff) : "-"}</span>
      </div>
    </div>
  </div>
</div>
