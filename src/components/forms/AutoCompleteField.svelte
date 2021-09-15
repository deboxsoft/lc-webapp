<script>
  import { clsx } from "@deboxsoft/module-client";
  import { getFormContext } from "__@stores/form";
  import AutoComplete from "../AutoComplete.svelte";
  import { createEventDispatcher } from "svelte";

  const { fields, validateField, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let name;
  export let pristineValue= undefined;
  export let items;
  export let valueFieldName = undefined;
  export let labelFunction = undefined;
  export let keywordsFunction = undefined;
  export let allowEmpty  = false;
  export let create = false;
  export let inputClassName = "";
  export let hiddenResultText = "data tidak ditampilkan";
  export let createText = "Data tidak ditemukan, menambah data baru?";
  export let loadingText = "Memuat data...";
  export let noResultsText = "Data tidak ditemukan";
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
    const validate = validateField(name);
    return ({ value }) => {
      if ($fields && name) {
        $fields[name] = value;
      }
      validate && validate(value);
      dispatcher("change", value);
    };
  }
</script>

<AutoComplete
  {...$$restProps}
  {create}
  {hiddenResultText}
  {createText}
  {loadingText}
  {noResultsText}
  {disabled}
  {allowEmpty}
  {pristineValue}
  {valueFieldName}
  {selectedItem}
  {labelFunction}
  {keywordsFunction}
  inputClassName={_inputClassName}
  onChange={createChangeHandler()}
  {items} >
  <slot name="item" slot="item" let:item {item} let:label {label}>
    {@html label}
  </slot>
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</AutoComplete>

