<script lang="ts">
  import type { JournalAccount, JournalAccountInput } from "@deboxsoft/accounting-api";
  import type { FormStore } from "@deboxsoft/svelte-forms";
  import { derived } from "svelte/store";
  import type { Writable } from "svelte/store";

  import CellRp from "__@comps/CellRp.svelte";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { url } from "@roxi/routify";
  import { getAccountContext } from "__@modules/transaksi";
  import { convertToRp } from "__@root/utils";
  import JournalAccountItemForm from "./JournalAccountItemForm.svelte";

  export let journalAccountsInput: Writable<JournalAccountInput[]>;
  export let formStore: FormStore;

  $: formStore.setValue("accounts", $journalAccountsInput);

  let openDialogShow: boolean = false;
  let journalAccountSelected: { journalAccount: Partial<JournalAccount>; index: number };

  $: console.log($journalAccountsInput);

  const total = derived(journalAccountsInput, ($_, set) => {
    let debit = 0;
    let credit = 0;
    $_.forEach((_journalAccount) => {
      if (_journalAccount.isCredit) {
        credit += parseInt(_journalAccount.amount);
      } else {
        debit += parseInt(_journalAccount.amount);
        formStore.setValue("total", debit);
      }
    });
    set({ debit, credit, diff: debit - credit });
  });

  // function amountInputHandler(index: number) {
  //   return (e) => {
  //     const amount = e.target.value;
  //     $journalAccountsInput[index] = parseInt(e.target.value);
  //   };
  // }

  function journalAccountUpdateHandler(_selected: { journalAccount: JournalAccount; index: number }) {
    if (_selected) {
      journalAccountSelected = _selected;
      openDialogShow = true;
    }
  }

  function removeAccountHandler(index: number) {
    journalAccountsInput.update((_) => {
      _.splice(index, 1);
    });
  }

  function addAccountJournalHandler() {
    $journalAccountsInput = [...$journalAccountsInput, { amount: 0 }];
  }
</script>

<div class="card flex-grow-1">
  <!--  <div class="card-header header-elements-inline">-->
  <!--    <div class="header-elements" />-->
  <!--    <div class="card-title">-->

  <!--    </div>-->
  <!--  </div>-->
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
        {#each $journalAccountsInput as journalAccount, index}
          <JournalAccountItemForm {journalAccount} {index} onRemoveAccount={removeAccountHandler} />
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button class="btn btn-light" on:click={addAccountJournalHandler}>
        <ListPlusIcon class="mr-2" />
        Tambah Akun
      </button>
    </div>
    {#if $total.debit > 0 || $total.credit > 0}
      {#if $total.diff === 0}
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
        <span>{$total.debit ? convertToRp(parseInt($total.debit)) : '-'}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Total Kredit: Rp.</span>
        <span>{$total.credit ? convertToRp(parseInt($total.credit)) : '-'}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1"> Selisih: Rp.</span>
        <span>{$total.diff ? convertToRp(parseInt($total.diff)) : '-'}</span>
      </div>
    </div>
  </div>
</div>
