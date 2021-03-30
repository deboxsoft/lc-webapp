<script lang="ts">
  import { utils } from "@deboxsoft/module-core";
  import { TransactionInputSchema } from "@deboxsoft/accounting-api";
  import { getFormContext } from "__@stores/form";
  import { getAccountContext } from "__@modules/accounting";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  // import AutoComplete from "__@comps/AutoComplete.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";
  import AccountCombox from "../../../../components/account/AccountCombox.svelte";

  const { debounce } = utils;
  export let id = getId("journal-account-item");
  export let input;
  export let creditDisable: boolean = false;
  export let index: number;
  export let fieldName: string = "accounts";
  export let minusCurrencyEnable: boolean = true;
  export let onRemoveJournalAccount = () => {
  };
  export let onUpdateJournalAccount = () => {
  };
  export let isValid: boolean = false;

  const { getAccountLeaf, getAccount } = getAccountContext();
  const accountStore = getAccountLeaf();

  const { fields, fieldsErrors } = getFormContext();


  // createFormContext({ schema: JournalAccountSchema, values: input, validateField });

  function validateField(_fieldName) {
    return (value: unknown) => {
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
    input.accountId = e.detail;
    updateHandler();
    validateField("accountId");
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
    <AccountCombox id="{id}-autocomplete" class="form-control" fieldDisable placeholder="pilih akun" allowEmpty on:change={accountSelectedHandler} />
<!--    <AutoComplete-->
<!--      id="{id}-autocomplete"-->
<!--      inputClassName="form-control"-->
<!--      placeholder="Pilih Akun"-->
<!--      items={$accountStore || []}-->
<!--      pristineValue={input.accountId}-->
<!--      bind:value={input.accountId}-->
<!--      on:change={accountSelectedHandler}-->
<!--      labelFunction={(account) => account && `${account.id} || ${account.name}`}-->
<!--      valueFieldName="id"-->
<!--      keywordsFunction={(account) => account && `${account.id} ${account.name}`} />-->
  </td>
  <!--{#if !creditDisable}-->
  <!--  <td>-->
  <!--    <div class="uniform-checker" style="margin-left: auto; margin-right: auto;">-->
  <!--      <span class:checked={input.isCredit}><input-->
  <!--          type="checkbox"-->
  <!--          class="form-check-input-styled"-->
  <!--          on:click={() => {-->
  <!--            input.isCredit = !input.isCredit;-->
  <!--            updateHandler();-->
  <!--          }}-->
  <!--          checked={input.isCredit} />-->
  <!--      </span>-->
  <!--    </div>-->
  <!--  </td>-->
  <!--{/if}-->
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
