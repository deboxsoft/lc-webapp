<script lang="ts">
  import type { JournalAccount, JournalAccountInput } from "@deboxsoft/accounting-api";
  import type { FormStore } from "@deboxsoft/svelte-forms";
  import { derived } from "svelte/store";
  import type { Writable } from "svelte/store";

  import CellRp from "__@comps/CellRp.svelte";
  import InputRp from "__@comps/InputRp.svelte";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import { url } from "@roxi/routify";
  import Modal from "@deboxsoft/svelte-theme-limitless/components/Modal.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import { getAccountContext } from "__@modules/transaksi";
  import { convertToRp } from "__@root/utils";
  import AccountDialog from "./AccountDialog.svelte";

  const { accountStore } = getAccountContext();

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
    set({ debit, credit });
  });

  // handler
  function accountSelectedHandler(index: number) {
    return (e) => {
      const accountId = e.detail;
      $journalAccountsInput[index] = { ...$journalAccountsInput[index], ...{ accountId } };
    };
  }

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
    return () => {};
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
          <tr>
            <td />
            <td>
              <AutoComplete
                id={getId('autocomplete')}
                inputClassName="form-control"
                placeholder="Pilih Akun"
                items={$accountStore || []}
                on:change={accountSelectedHandler(index)}
                labelFunction={(account) => account && `${account.code}  ${account.name}`}
                valueFieldName="id"
                keywordsFunction={(account) => account && `${account.code} ${account.name}`} />
            </td>
            <td>
              <div class="uniform-checker" style="margin-left: auto; margin-right: auto;">
                <span class:checked={journalAccount.isCredit}><input
                    type="checkbox"
                    class="form-check-input-styled"
                    on:click={() => {
                      journalAccount.isCredit = !journalAccount.isCredit;
                    }}
                    checked={journalAccount.isCredit} />
                </span>
              </div>
            </td>
            <td class="fit">
              <InputRp
                id="amount-{index}"
                class="form-control"
                name="amount"
                bind:value={journalAccount.amount} />
            </td>
            <td>
              <button
                type="button"
                class="btn btn-outline btn-icon alpha-danger text-danger"
                class:disabled={index < 2}
                disabled={index < 2}>
                <Icon component={TrashIcon} />
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button class="btn btn-light" on:click={addAccountJournalHandler}>
        <Icon component={ListPlusIcon} class="mr-2" />
        Tambah Akun
      </button>
    </div>
    <div class="d-flex flex-column" style="width: 250px">
      <div class="d-flex">
        <span class="flex-grow-1">Total Debit: Rp.</span>
        <span>{$total.debit ? convertToRp(parseInt($total.debit)) : '-'}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Total Kredit: Rp.</span>
        <span>{$total.credit ? convertToRp(parseInt($total.credit)) : '-'}</span>
      </div>
    </div>
  </div>
</div>
