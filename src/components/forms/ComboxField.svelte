<script>
  import { getFormContext } from "../../stores/form";
  import { getAccountContext } from "../../modules/accounting";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const accountContext = getAccountContext();
  export let items = [];
  export let name = undefined;
  export const select = $fields && $fields[name] || undefined;
  export let allowEmpty = false;
  export let labelId = "label"
  export let valueId = "id"
  export let value;
  const dispatch = createEventDispatcher();

  $: {
    if (items.length > 0 && !$fields[name] && !allowEmpty) {
      $fields[name] = items[0][valueId] || items[0]
    }
  }

  function createChangeHandler(e) {
    const _validate = validateField(name);
    return (e) => {
      _validate();
      dispatch("change", e.detail);
    };
  }
</script>

<select
  {...$$restProps}
  class="form-control form-control-uniform"
  bind:value={$fields[name]}
  on:change={createChangeHandler()}
>
  {#if allowEmpty}
    <option />
  {/if}
  {#each items as item}
    <option value={item[valueId] || item}>{item[labelId] || item}</option>
  {/each}
</select>
