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
  export let allowEmpty = false;
  export let labelId = "label";
  export let valueId = "id";
  export let value = $fields[name];
  export let placeHolder = undefined;
  export let className = $$props.class || "";

  let selectedIndex, isStartup;
  const dispatch = createEventDispatcher();

  $: {
    if (items.length > 0 && !$fields[name] && !allowEmpty && !placeHolder) {
      $fields[name] = items[0][valueId] || items[0];
    }
  }

  function createChangeHandler() {
    const _validate = validateField(name);
    return (e) => {
      selectedIndex = e.target.selectedIndex;
      _validate && _validate();
      $fields[name] = e.target.selected;
      dispatch("change", e.detail);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform {className}"
  class:empty={!!placeHolder && ((!selectedIndex && !$fields[name]) || selectedIndex === 0)}
  bind:value
  on:change={createChangeHandler()}
>
  {#if placeHolder}
    {#if allowEmpty && selectedIndex > 0}
      <option />
    {:else}
      <option selected disabled>{placeHolder}</option>
    {/if}
  {/if}
  {#each items as item}
    <option value={item[valueId] || item}>{item[labelId] || item}</option>
  {/each}
</select>

<style lang="scss">
  .empty {
    color: gray;
  }
</style>
