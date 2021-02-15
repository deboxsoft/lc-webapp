<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getFormContext } from "__@stores/form";
  import AutoComplete from "__@comps/AutoComplete.svelte";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let name;
  export let pristineValue: any = ($fields && $fields[name]) || undefined;
  export let items: any[];
  export let valueFieldName: string | undefined = undefined;
  export let labelFunction: undefined | ((val: any) => string) = undefined;
  export let keywordsFunction: undefined | ((val: any) => string) = undefined;
  export let inputClassName: string = "";
  const { class: className } = $$props;

  let invalid = true;
  let msgError;
  let _inputClassName;

  $: {
    const _valid = $submitted ? (invalid ? "is-invalid" : "is-valid") : "";
    _inputClassName = clsx(inputClassName, _valid);
  }

  $: {
    if ($fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  function createChangeHandler() {
    const _validate = validateField(name);
    return (e) => {
      $fields[name] = e.detail;
      _validate();
      dispatcher("input", e);
    };
  }
</script>

<AutoComplete
  {...$$restProps}
  {pristineValue}
  {valueFieldName}
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

