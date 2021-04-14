<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getFormContext } from "__@stores/form";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let name;
  export let pristineValue: any = undefined;
  export let items: any[];
  export let valueFieldName: string | undefined = undefined;
  export let labelFunction: undefined | ((val: any) => string) = undefined;
  export let keywordsFunction: undefined | ((val: any) => string) = undefined;
  export let allowEmpty: boolean = false;
  export let inputClassName: string = "";
  export let disabled = false;
  const { class: className } = $$props;

  let invalid = true;
  let msgError;
  let _inputClassName;
  let selectedItem;

  if ($fields && name) {
    if (pristineValue && !$fields[name]) {
      $fields[name] = pristineValue
    } else if (!pristineValue) {
      pristineValue = $fields[name];
    }
  }

  $: {
    const _valid = $submitted ? (invalid ? "is-invalid" : "is-valid") : "";
    _inputClassName = clsx(inputClassName, _valid);
  }

  $: {
    if ($fieldsErrors && name && $fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  function createChangeHandler() {
    const _validate = validateField && validateField(name);
    return (e) => {
      if ($fields && name) {
        $fields[name] = e.detail;
      }
      _validate && _validate();
      dispatcher("change", e.detail);
    };
  }
</script>

<AutoComplete
  {...$$restProps}
  {disabled}
  {allowEmpty}
  {pristineValue}
  {valueFieldName}
  {selectedItem}
  {labelFunction}
  {keywordsFunction}
  inputClassName={_inputClassName}
  on:change={createChangeHandler()}
  {items} >
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</AutoComplete>

