<script>
  import { debounce } from "@deboxsoft/module-core";
  import { createFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { filteringAccountPayment } from "__@root/utils";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import { getItemContext } from "./bdd-payment-item-context";

  export let id = generateId({ prefix: "item", size: 3 });
  export let item;
  export let index;

  const itemContext = getItemContext();
  const { getAccountLeaf, getAccount } = stores.getAccountContext();
  const { fields } = createFormContext({ values: item });
  let accountStore = [];
  $: {
    const _accounts = getAccountLeaf();
    accountStore = filteringAccountPayment(_accounts);
  }

  function createAccountSelectedHandler() {
    return () => {
      updateHandler();
    };
  }

  function amountHandler() {
    return debounce((e) => {
      updateHandler();
    });
  }

  function updateHandler() {
    itemContext.updateItem($fields);
  }

  function removeHandler() {
    itemContext.removeItem(index);
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
    <InputRp id="{id}-amount" class="form-control" name="amount" on:input={amountHandler()} />
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
