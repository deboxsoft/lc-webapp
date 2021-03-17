<script lang="ts">
  import { utils } from "@deboxsoft/module-core";
  import { TransactionInputSchema, JournalAccountSchema } from "@deboxsoft/accounting-api";
  import { createFormContext, getFormContext } from "__@stores/form";
  import { getAccountContext } from "__@modules/accounting";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import { getId } from "@deboxsoft/svelte-theme-limitless/utils";

  const { debounce } = utils;
  export let id = getId("journal-account-item");
  export let input;
  export let creditDisable: boolean = false;
  export let index: number;
  export let minusCurrencyEnable: boolean = !creditDisable;
  export let onRemoveJournalAccount = () => {};
  export let onUpdateJournalAccount = () => {};

  const { accountStore = [], getAccount } = getAccountContext();

  const { submitted, fields } = getFormContext();
  createFormContext({ schema: JournalAccountSchema, values: input, validateField });

  function validateField(fieldName) {
    return (value: unknown) => {
      if ($submitted) {
        TransactionInputSchema.pick({ [fieldName]: true }).safeParse({ [fieldName]: $fields[index][fieldName] });
        // @ts-ignore
        const { success, error } = parsed;
        fieldsErrors.update(($fieldsErrors) => {
          $fieldsErrors[fieldName] = !success ? error.errors[0].message : undefined;
          return $fieldsErrors;
        });
      }
    };
  }

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
      pristineValue={input.accountId}
      bind:value={input.accountId}
      on:change={accountSelectedHandler}
      labelFunction={(account) => account && `${account.code}  ${account.name}`}
      valueFieldName="id"
      keywordsFunction={(account) => account && `${account.code} ${account.name}`} />
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
      on:input={updateAmountHandler()}
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
