<script lang="ts">
  import type { Transaction } from "@deboxsoft/accounting-api";

  import { get } from "svelte/store";
  import { lightFormat, parseISO } from "date-fns";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import CellRp from "__@comps/CellRp.svelte";
  import RowJournalAccount from "./RowJournalAccount.svelte";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccount } = getAccountContext();

  export let journal: Transaction;
  // export let index: number;
  export let expanded: boolean = false;

  let classes = "";
  $: classes = clsx("odd", expanded && "parent");
</script>

<tr class={classes} style="cursor: pointer" on:click>
  <td
    class="control d-table-cell"
    on:click|stopPropagation={() => {
      expanded = !expanded;
    }} />
  <td class="d-none d-lg-table-cell">{journal.noJournal || ''}</td>
  <td class="d-none d-xl-table-cell">{journal.noTransaction || ''}</td>
  <td class="text-center">{lightFormat(parseISO(journal.date), 'dd-MM-yyyy') || ''}</td>
  <td class="text-center">{get(getAccount(journal.accountId))?.name || ''}</td>
  <td>{journal.description || ''}</td>
  <td>
    <CellRp value={journal.total || ''} />
  </td>
</tr>
{#if expanded}
  <tr class="child d-xl-none">
    <td class="child d-table-cell" colspan="10">
      <ul class="dtr-details">
        <li class="d-lg-none"><span class="dtr-title">No</span> <span class="dtr-data">{journal.noJournal}</span></li>
        <li><span class="dtr-title">No Transaksi</span> <span class="dtr-data">{journal.noTransaction || ''}</span></li>
      </ul>
    </td>
  </tr>
  <tr class="child">
    <td class="child d-table-cell px-5" colspan="10" style="border-bottom: 1px double; border-top: 1px solid;">
      <table class="table">
        <thead>
          <tr>
            <th class="text-center" style="width: 150px">Kode Akun</th>
            <th class="text-center">Nama Akun</th>
            <th class="text-center" style="width: 200px">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {#each journal.accounts as journalAccount}
            <RowJournalAccount {journalAccount} />
          {/each}
        </tbody>
      </table>
    </td>
  </tr>
{/if}
