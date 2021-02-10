<script lang="ts">
  import { utils } from "@deboxsoft/module-core";
  import { getAccountContext } from "__@modules/accounting";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import InputRp from "__@comps/InputRp.svelte";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";

  const { debounce } = utils;
  export let id = getId("journal-account-item");
  export let input;
  export let minusCurrencyEnable: boolean = false;
  export let onRemoveJournalAccount = () => {};
  export let onUpdateJournalAccount = () => {};

  const { accountStore = [], getAccount } = getAccountContext();
  let account = getAccount(input.accountId);

  function accountSelectedHandler(e) {
    input.accountId = e.detail;
    updateHandler();
  }

  function updateAmountHandler() {
    return debounce((e) => {
      input.amount = e.detail;
      updateHandler();
    });
  }

  function updateHandler() {
    onUpdateJournalAccount(input);
  }

  function removeHandler() {
    const { index } = input;
    onRemoveJournalAccount(index);
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
      selectedItem={$account}
      on:change={accountSelectedHandler}
      labelFunction={(account) => account && `${account.code}  ${account.name}`}
      valueFieldName="id"
      keywordsFunction={(account) => account && `${account.code} ${account.name}`} />
  </td>
  <td>
    <div class="uniform-checker" style="margin-left: auto; margin-right: auto;">
      <span class:checked={input.isCredit}><input
          type="checkbox"
          class="form-check-input-styled"
          on:click={() => {
            input.isCredit = !input.isCredit;
            updateHandler();
          }}
          checked={input.isCredit} />
      </span>
    </div>
  </td>
  <td class="fit">
    <InputRp
      id="{id}-amount"
      class="form-control"
      name="amount"
      value={input.amount}
      on:input={updateAmountHandler()}
      signed={false} />
  </td>
  <td>
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={input.index < 2}
      disabled={input.index < 2}>
      <TrashIcon />
    </button>
  </td>
</tr>
