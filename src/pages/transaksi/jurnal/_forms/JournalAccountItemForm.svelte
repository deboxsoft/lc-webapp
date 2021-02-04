<script lang="ts">
  import type { JournalAccount, JournalAccountInput } from "@deboxsoft/accounting-api";
  import type { Writable } from "svelte/store";

  import { getAccountContext } from "__@modules/transaksi";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import InputRp from "__@comps/InputRp.svelte";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";

  export let index: number;
  export let journalAccount: JournalAccount;
  export let id = getId("journal-account-item");
  export let onRemoveAccount;

  const { accountStore } = getAccountContext();

  // handler
  function accountSelectedHandler(e) {
    const accountId = e.detail;
    journalAccount = { ...journalAccount, ...{ accountId } };
  }

  function removeHandler() {
    onRemoveAccount(index);
  }
</script>

<tr>
  <td />
  <td>
    <AutoComplete
      id="{id}-autocomplete"
      inputClassName="form-control"
      placeholder="Pilih Akun"
      items={$accountStore || []}
      on:change={accountSelectedHandler}
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
    <InputRp id="{id}-amount" class="form-control" name="amount" bind:value={journalAccount.amount} signed={false} />
  </td>
  <td>
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={index < 2}
      disabled={index < 2}>
      <TrashIcon />
    </button>
  </td>
</tr>
