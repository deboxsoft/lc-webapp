<script lang="ts">
  import type { JournalAccountInput } from "@deboxsoft/accounting-api";

  import { getFormContext, createFormContext } from "__@stores/form";
  import { writable } from "svelte/store";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import { convertToRp } from "__@root/utils";
  import JournalAccountItemForm from "./FormJournalAccountItem.svelte";

  const { schema, fields, fieldsErrors } = getFormContext();
  const journalAccountSchema = schema.pick({ accounts: true });
  createFormContext({ schema: journalAccountSchema, values: fields["accounts"] });

  const createJournalAccount = () => ({ index: getId({ prefix: "account-input", size: 3 }) });

  export let total: number = 0;
  export let creditDisable: boolean = true;

  let journalAccountsStore = writable($fields.accounts.map((_) => ({ ..._, ...createJournalAccount() })));

  let debit: string = "-";
  let credit: string = "-";
  let diff: number = NaN;

  $: {
    let _debit = 0;
    let _credit = 0;
    $journalAccountsStore.forEach((_) => {
      if (_.isCredit) {
        _credit += parseInt(_.amount || 0);
      } else {
        _debit += parseInt(_.amount || 0);
      }
    });
    debit = _debit;
    credit = _credit;
    diff = _debit - _credit;
    $fields.total = debit;
  }

  function addJournalAccountHandler() {
    $journalAccountsStore = [...$journalAccountsStore, createJournalAccount()];
  }

  function updateJournalAccountHandler(input: JournalAccountInput) {
    const i = $journalAccountsStore.findIndex((_) => _.index === input.index);
    $journalAccountsStore[i] = input;
    $fields.accounts[i] = input;
  }

  function removeJournalAccountHandler(index: number) {
    let inputs = $journalAccountsStore;
    inputs = inputs.filter((_) => _.index !== index);
    $journalAccountsStore = inputs;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th class="text-center" style="width: 20px">#</th>
          <th>Akun</th>
          {#if !creditDisable}
            <th style="width: 20px;">Kredit</th>
          {/if}
          <th class="text-center" style="width: 275px">Jumlah</th>
          <th class="text-center" style="width: 20px">#</th>
        </tr>
      </thead>
      <tbody>
        {#each $journalAccountsStore as journalAccountInput, index (journalAccountInput.index)}
          <JournalAccountItemForm
            {creditDisable}
            {index}
            input={journalAccountInput}
            onRemoveJournalAccount={removeJournalAccountHandler}
            onUpdateJournalAccount={updateJournalAccountHandler} />
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
    <!--{#if debit > 0 || credit > 0}-->
    <!--  {#if diff === 0}-->
    <!--    <div class="text-success" style="width: 30px;">-->
    <!--      <CheckIcon />-->
    <!--    </div>-->
    <!--  {:else}-->
    <!--    <div class="text-danger" style="width: 30px;">-->
    <!--      <CloseIcon />-->
    <!--    </div>-->
    <!--  {/if}-->
    <!--{/if}-->
    <div class="d-flex flex-column" style="width: 250px">
      <div class="d-flex">
        <span class="flex-grow-1">Total: Rp.</span>
        <span>{debit ? convertToRp(parseInt(debit)) : '-'}</span>
      </div>
      {#if !creditDisable}
        <div class="d-flex">
          <span class="flex-grow-1">Total Kredit: Rp.</span>
          <span>{credit ? convertToRp(parseInt(credit)) : '-'}</span>
        </div>
        <div class="d-flex" style="border-top: solid 1px gray">
          <span class="flex-grow-1"> Selisih: Rp.</span>
          <span>{diff ? convertToRp(diff) : '-'}</span>
        </div>
      {/if}
    </div>
  </div>
</div>
