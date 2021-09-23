<script>
  import { writable } from "svelte/store";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";
  import Button from "../Button.svelte";

  const { validateField, fields = writable({}), fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();
  export let name;
  export let value;
  export let id = name;
  export let ref;
  const { class: className } = $$props;

  let invalid = true,
    msgError,
    isPlain = false;

  $: {
    if ($fieldsErrors && $fieldsErrors[name]) {
      invalid = true;
      msgError = Array.isArray($fieldsErrors[name])
        ? $fieldsErrors[name].length > 0 && $fieldsErrors[name][0]
        : $fieldsErrors[name];
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

  function toggleHandler() {
    isPlain = !isPlain;
  }
</script>

<div class="input-group">
  {#if isPlain}
    <input
      {...$$restProps}
      {id}
      type="text"
      class={className}
      bind:this={ref}
      bind:value={$fields[name]}
      class:is-valid={$submitted && !invalid}
      class:is-invalid={$submitted && invalid}
      on:input={createInputHandler()}
      on:keydown
      on:keypress
    />
    <div class="input-group-append">
      <Button class="btn btn-light btn-icon" style="height: 36px"on:click={toggleHandler} tabindex="-1">
        <i class="icon-eye-blocked" />
      </Button>
    </div>
  {:else}
    <input
      {...$$restProps}
      {id}
      type="password"
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
    <div class="input-group-append">
      <Button class="btn btn-light btn-icon" style="height: 36px"on:click={toggleHandler} tabindex="-1">
        <i class="icon-eye" />
      </Button>
    </div>
  {/if}
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</div>
