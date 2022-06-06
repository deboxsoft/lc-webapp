<script>
  import { debounce } from "@deboxsoft/module-core";
  import { createFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { filteringAccountCredit, filteringAccountDebit } from "__@root/utils";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  export let id = generateId({ prefix: "journal-account-item" });
  export let values;
  export let index;
  export let isCredit;
  export let fieldName = "oppositeAccounts";
  export const minusCurrencyEnable = true;
  export let accountStore = undefined;
  export let onRemoveJournalAccount = () => {};
  export let onUpdateJournalAccount = () => {};

  const { getAccountLeaf, getAccount } = stores.getAccountContext();
  const { fields } = createFormContext({ values });
  $: {
    if (!accountStore) {
      const _accounts = getAccountLeaf();
      if (isCredit) {
        accountStore = filteringAccountDebit(_accounts);
      } else {
        accountStore = filteringAccountCredit(_accounts);
      }
    }
  }

  function createAccountSelectedHandler() {
    return () => {
      updateHandler();
    };
  }

  function createUpdateAmountHandler() {
    return debounce((e) => {
      updateHandler();
    });
  }

  function updateHandler() {
    onUpdateJournalAccount($fields);
  }

  function removeHandler() {
    onRemoveJournalAccount(index);
  }
</script>

<tr>
  <td>
    <AccountSelect
      id="{id}-autocomplete"
      name="id"
      inputClassName="form-control"
      placeholder="Pilih Akun"
      {accountStore}
      allowEmpty
      on:change={createAccountSelectedHandler()}
    />
  </td>
  <td class="fit">
    <InputRp id="{id}-amount" class="form-control" name="amount" on:input={createUpdateAmountHandler()} />
  </td>
  <td style="padding: unset">
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={index < 1}
      disabled={index < 1}
    >
      <TrashIcon />
    </button>
  </td>
</tr>
