<script>
  import { derived } from "svelte/store";
  import { debounce } from "@deboxsoft/module-core";
  import { TransactionInputSchema } from "@deboxsoft/accounting-api";
  import { getFormContext } from "__@stores/form";
  import { stores } from "@deboxsoft/accounting-client";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  // import AccountCombox from "../../../../components/account/AccountCombox.svelte";

  export let id = generateId("journal-account-item");
  export let input;
  export const creditDisable = false;
  export let index;
  export let fieldName = "creditAccounts";
  export const minusCurrencyEnable = true;
  export let onRemoveJournalAccount = () => {
  };
  export let onUpdateJournalAccount = () => {
  };
  export const isValid = false;

  const { getAccountLeaf, getAccount } = stores.getAccountContext();
  const accountStore = getAccountCredit();

  const { fields, fieldsErrors } = getFormContext();


  function getAccountCredit () {
    const accountStore = getAccountLeaf();
    return derived(accountStore, (_) => _.filter((_) => {
      return /^[^5].*/g.test(_.id);
    }))
  }
  // createFormContext({ schema: JournalAccountSchema, values: input, validateField });

  function validateField(_fieldName) {
    return (value) => {
      const parsed = TransactionInputSchema.pick({ [_fieldName]: true }).safeParse({ [_fieldName]: $fields[fieldName][index][_fieldName] });
      // @ts-ignore
      const { success, error } = parsed;
      const key = `${fieldName}.${index}.${_fieldName}`;
      if (error) {
        $fieldsErrors[key] = error.errors[0].message;
      } else if ($fieldsErrors[key]) {
        delete $fieldsErrors[key];
      }
    };
  }

  function accountSelectedHandler(e) {
    input.id = e.detail;
    updateHandler();
    validateField("id");
  }

  function createUpdateAmountHandler() {
    return debounce((e) => {
      input.amount = e.detail;
      validateField("amount");
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
<!--    <AccountCombox id="{id}-autocomplete" class="form-control" fieldDisable placeholder="pilih akun" allowEmpty on:change={accountSelectedHandler} />-->
    <AutoComplete
      id="{id}-autocomplete"
      inputClassName="form-control"
      placeholder="Pilih Akun"
      items={$accountStore || []}
      pristineValue={input.id}
      bind:value={input.id}
      on:change={accountSelectedHandler}
      labelFunction={(account) => account && `${account.id} - ${account.name}`}
      valueFieldName="id"
      keywordsFunction={(account) => account && `${account.id} ${account.name}`} />
  </td>
  <td class="fit">
    <InputRp
      id="{id}-amount"
      class="form-control"
      name="amount"
      value={input.amount}
      on:input={createUpdateAmountHandler()}
      formContextDisable
      signed />
  </td>
  <td>
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={index < 1}
      disabled={index < 1}>
      <TrashIcon />
    </button>
  </td>
</tr>
