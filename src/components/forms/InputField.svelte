<script>
  import { writable } from "svelte/store";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields = writable({}), fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();
  export let name;
  export let value = undefined;
  export let id = name;
  export let ref;
  const { class: className = "form-control" } = $$props;
  if (value && !$fields[name]) {
    $fields[name] = value;
  }

  let invalid = true;
  let msgError;

  $: {
    if ($fieldsErrors && $fieldsErrors[name]) {
      invalid = true;
      msgError = Array.isArray($fieldsErrors[name])
        ? $fieldsErrors[name].length > 0 && $fieldsErrors[name][0]
        : $fieldsErrors[name];
      if (typeof msgError !== "string" && msgError.message) {
        msgError = msgError.message;
      }
    } else {
      invalid = false;
    }
  }

  function createInputHandler() {
    const _validate = validateField(name);
    return (e) => {
      _validate();
      dispatcher("input", e);
    };
  }
</script>

<input
  {...$$restProps}
  {id}
  autocomplete="off"
  class={className}
  bind:this={ref}
  bind:value={$fields[name]}
  class:is-valid={$submitted && !invalid}
  class:is-invalid={$submitted && invalid}
  on:input={createInputHandler()}
  on:keydown
  on:keypress
/>
{#if $submitted}
  {#if invalid}
    <label for={id} class="validation-invalid-label">{msgError || ""}</label>
  {/if}
{/if}
