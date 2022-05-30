<script>
  import { getFormContext } from "__@stores/form";
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
  export let allowEmpty = false;
  export let labelId = "label";
  export let labelFunc = (_) => (typeof _ === "object" ? _[labelId] : _);
  export let valueId = "id";
  export let valueFunc = (_) => (typeof _ === "object" ? _[valueId] : _);
  export let labelEmpty = "-";
  export let valueEmpty = "";
  export let value = $fields[name];
  export let placeholder = undefined;
  export let className = $$props.class || "";

  let selectedIndex;
  const dispatch = createEventDispatcher();

  $: {
    if (items.length > 0 && !$fields[name] && !allowEmpty && !placeholder) {
      $fields[name] = items[0][valueId] || items[0];
    }
  }

  function createChangeHandler() {
    const _validate = validateField(name);
    return (e) => {
      $fields[name] = e.target.value === "" ? undefined : e.target.value;
      selectedIndex = e.target.selectedIndex;
      _validate && _validate();
      const index = allowEmpty ? selectedIndex - 1 : selectedIndex;
      dispatch("change", index >= 0 ? items[index] : undefined);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform {className}"
  class:empty={!!placeholder && ((!selectedIndex && !$fields[name]) || selectedIndex === 0)}
  bind:value
  on:change={createChangeHandler()}
>
  {#if allowEmpty}
    <option value={valueEmpty}>{labelEmpty}</option>
  {:else if placeholder}
    <option disabled>{placeholder}</option>
  {/if}
  {#each items as item}
    <option value={valueFunc(item)}>{labelFunc(item)}</option>
  {/each}
</select>

<style lang="scss">
  .empty {
    color: gray;
  }
</style>
