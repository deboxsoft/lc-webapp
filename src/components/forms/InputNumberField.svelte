<script>
  import { clsx } from "@deboxsoft/module-client";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  export let formContextDisable = false;
  const context = (!formContextDisable && getFormContext()) || {};
  const dispatcher = createEventDispatcher();

  export let options = {};
  export let fields = context?.fields;
  export let fieldsErrors = context?.fieldsError;
  export let prependDisable = false;
  export let textPosition = "right";
  export let name;
  export let disabled = false;
  export let format = "currency";
  export let resultType = "number";
  export let pristineValue = undefined;
  export let value = undefined;

  const defaultOptions = {
    decimalPlaces: format === "currency" ? 2 : 0,
    modifyValueOnWheel: false,
    digitGroupSeparator: ".",
    decimalCharacter: ","
  };

  let { class: className } = $$props;

  // state
  let msgError;
  let invalid = false;
  let classes = "";
  let submitted = context.submitted;
  let autoNumeric;
  let inputEl;

  if (fields && name && !pristineValue) {
    pristineValue = $fields[name];
  }

  $: {
    if (format === "number") {
      options = { ...AutoNumeric.getPredefinedOptions().integerPos, ...options }
    }
  }

  $: {
    if (!formContextDisable) {
      if (fieldsErrors && name && $fieldsErrors[name]) {
        invalid = true;
        msgError = $fieldsErrors[name];
      } else {
        invalid = false;
      }
    }
  }

  $: {
    fields && name && autoNumeric && value !== $fields[name] && (autoNumeric.set($fields[name] || ""))
  }

  $: classes = clsx(className, "form-control", textPosition === "right" && "text-right");

  onMount(() => {
    autoNumeric = new AutoNumeric(inputEl, { ...defaultOptions, ...options });
    value && autoNumeric.set(value);
  })

  onDestroy(() => {
    autoNumeric.wipe();
  })


  function createInputHandler() {
    const _validate = context.validateField ? context.validateField(name): (() => {});
    return () => {
      let result = autoNumeric.getNumericString();
      if (resultType === "number") {
        result = parseFloat(result);
      }
      if ($fields && name) {
        $fields[name] = result;
      }
      value = result;
      _validate();
      dispatcher("input", result);
    };
  }
</script>

<div class="input-group">
  {#if !prependDisable}
    <div class="input-group-prepend"><span class="input-group-text">Rp</span></div>
  {/if}
  <input
    bind:this={inputEl}
    type="text"
    {...$$restProps}
    {name}
    {disabled}
    autocomplete="off"
    class={classes}
    on:input={createInputHandler()}
    on:click
    on:keydown
    on:change
    on:focus
    on:blur />
  <slot />
</div>
{#if $submitted}
  {#if invalid}
    <p class="invalid-tooltip">{(msgError && msgError.length > 1 && msgError[0]) || ''}</p>
  {/if}
{/if}
