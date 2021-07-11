<script>
  import { getFormContext } from "../../stores/form";
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {
    fields: writable({}),
    validateField: () => {},
    submitted: false,
    fieldsErrors: writable(undefined)
  };
  export let items = [];
  export let name = undefined;
  export const select = $fields && $fields[name] || undefined;
  export let allowEmpty = false;
  export let labelId = "label"
  export let valueId = "id"
  export let value = undefined;
  export let placeHolder = "";
  export let className = $$props.class || "";

  $fields[name] = value || select;
  const dispatch = createEventDispatcher();

  $: {
    if (items.length > 0 && !$fields[name] && !allowEmpty) {
      $fields[name] = items[0][valueId] || items[0]
    }
  }

  function createChangeHandler(e) {
    const _validate = validateField(name);
    return (e) => {
      _validate && _validate();
      value = $fields[name];
      dispatch("change", e.detail);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform {className}"
  bind:value={$fields[name]}
  on:change={createChangeHandler()}
>
  {#if allowEmpty}
    <option label={placeHolder} />
  {/if}
  {#each items as item}
    <option value={item[valueId] || item}>{item[labelId] || item}</option>
  {/each}
</select>
