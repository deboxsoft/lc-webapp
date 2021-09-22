<script>
  import { debounce } from "@deboxsoft/module-core";
  import { createFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { filteringAccountCredit } from "__@root/utils";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  export let id = generateId({ prefix: "journal-account-item" });
  export let values;
  export const creditDisable = false;
  export let index;
  export let fieldName = "creditAccounts";
  export const minusCurrencyEnable = true;
  export let onRemoveJournalAccount = () => {};
  export let onUpdateJournalAccount = () => {};

  const { getAccountLeaf, getAccount } = stores.getAccountContext();
  const accountStore = getAccountCredit();

  const { fields } = createFormContext({ values });

  function getAccountCredit() {
    const accountStore = getAccountLeaf();
    return filteringAccountCredit(accountStore);
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
      accountStore={getAccountCredit()}
      allowEmpty
      on:change={createAccountSelectedHandler()}
    />
  </td>
  <td class="fit">
    <InputRp
      id="{id}-amount"
      class="form-control"
      name="amount"
      on:input={createUpdateAmountHandler()}
      formContextDisable
      signed
    />
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
