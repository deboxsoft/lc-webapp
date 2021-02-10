<script lang="ts">
  import type { JournalAccount, JournalAccountInput } from "@deboxsoft/accounting-api";

  import { writable } from "svelte/store";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { convertToRp } from "__@root/utils";
  import JournalAccountItemForm from "./FormJournalAccountItem.svelte";

  export let journalAccounts: JournalAccount[] = [];
  export let total: number = 0;
  export let creditDisable: boolean = false;

  let debit: string = "-";
  let credit: string = "-";
  let diff: string = "-";

  let _journalAccountsStore;
  $: _journalAccountsStore = writable(
    journalAccounts.map((_) => ({ index: getId({ prefix: "account-input", size: 3 }), ..._ }))
  );

  $: {
    let _debit = 0;
    let _credit = 0;
    $_journalAccountsStore.forEach((_) => {
      if (_.isCredit) {
        _credit += parseInt(_.amount || 0);
      } else {
        _debit += parseInt(_.amount || 0);
      }
    });
    debit = _debit;
    credit = _credit;
    diff = _debit - _credit;
    total = debit;
  }

  function addJournalAccountHandler() {
    $_journalAccountsStore = [...$_journalAccountsStore, { index: getId({ prefix: "account-input", size: 3 }) }];
  }

  function updateJournalAccountHandler(input: JournalAccountInput) {
    const i = $_journalAccountsStore.findIndex((_) => _.index === input.index);
    $_journalAccountsStore[i] = input;
  }

  function removeJournalAccountHandler(index: number) {
    let inputs = $_journalAccountsStore;
    inputs = inputs.filter((_) => _.index !== index);
    $_journalAccountsStore = inputs;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th style="width: 20px">#</th>
          <th>Akun</th>
          <th style="width: 20px;">Kredit</th>
          <th style="width: 275px">Jumlah</th>
          <th style="width: 20px">#</th>
        </tr>
      </thead>
      <tbody>
        {#each $_journalAccountsStore as journalAccountInput (journalAccountInput.index)}
          <JournalAccountItemForm
            input={journalAccountInput}
            onRemoveJournalAccount={removeJournalAccountHandler}
            onUpdateJournalAccount={updateJournalAccountHandler} />
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button class="btn btn-light" on:click={addJournalAccountHandler}>
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
        <span>{debit ? convertToRp(parseInt(debit)) : '-'}</span>
      </div>
      {#if !creditDisable}
        <div class="d-flex">
          <span class="flex-grow-1">Total Kredit: Rp.</span>
          <span>{credit ? convertToRp(parseInt(credit)) : '-'}</span>
        </div>
        <div class="d-flex" style="border-top: solid 1px gray">
          <span class="flex-grow-1"> Selisih: Rp.</span>
          <span>{diff ? convertToRp(parseInt(diff)) : '-'}</span>
        </div>
      {/if}
    </div>
  </div>
</div>
