<script lang="ts">
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher: any = createEventDispatcher();
  export let name: any;
  export let value: any = ($fields && $fields[name]) || undefined;
  const { class: className } = $$props;

  let invalid = true;
  let msgError: string[] | undefined;

  $: {
    if ($fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  function createInputHandler() {
    const _validate = validateField(name);
    return (e: any) => {
      _validate();
      dispatcher("input", e);
    };
  }
</script>

<input
  {...$$restProps}
  class={className}
  bind:value={$fields[name]}
  class:is-valid={$submitted && !invalid}
  class:is-invalid={$submitted && invalid}
  on:input={createInputHandler()} />
{#if $submitted}
  {#if invalid}
    <p class="invalid-tooltip">{(msgError && msgError.length > 0 && msgError[0]) || ''}</p>
  {/if}
{/if}
