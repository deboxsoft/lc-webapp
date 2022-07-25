<script>
  import { clsx } from "@deboxsoft/module-client";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  const { fields, fieldsErrors, validateField, submitted } = getFormContext();
  const dispatch = createEventDispatcher();
  export let format = "currency";
  export let emptyInputBehavior = "null";
  const defaultOptions = {
    emptyInputBehavior,
    allowDecimalPadding: "floats",
    modifyValueOnWheel: false,
    digitGroupSeparator: format === "currency" ? "." : ",",
    decimalCharacter: format === "currency" ? "," : "."
  };
  export let name;
  export let prependDisable = false;
  export let textPosition = "right";
  export let disabled = false;
  export let resultType = "number";
  export let pristineValue = undefined;
  export let value = pristineValue;
  export let maximumValue = "10000000000000";
  export let minimumValue = "-10000000000000";
  export let decimalPlaces = 2;
  export let options = { ...AutoNumeric.getPredefinedOptions().integerPos, ...defaultOptions };
  export let decimalEnable = false;
  export let autoNumeric = undefined;

  let { class: className } = $$props;

  // state
  let msgError;
  let invalid = false;
  let classes = "";
  let inputEl;

  $: {
    if ($fields && name && $fields[name] && !value) {
      value = $fields[name];
    }
  }

  $: {
    if (format === "number") {
      options = { ...options, maximumValue, minimumValue, decimalPlaces: decimalEnable ? decimalPlaces : 0 };
    } else {
      options = { ...options, maximumValue, minimumValue, decimalPlaces };
    }
  }

  $: {
    if (fieldsErrors && name && $fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  $: {
    if (fields && name && autoNumeric && isFinite(value) && value !== $fields[name]) {
      autoNumeric.set($fields[name], options);
    }
  }

  $: classes = clsx(className, "form-control", textPosition === "right" && "text-right");

  onMount(() => {
    autoNumeric = new AutoNumeric(inputEl, { ...defaultOptions, ...options });
    isFinite(value) && autoNumeric.set(value);
  });

  onDestroy(() => {
    autoNumeric.wipe();
  });

  export function setValue(value) {
    if (isFinite(value)) {
      autoNumeric.set(value, options);
    }
  }

  function createInputHandler() {
    const validate = validateField(name);
    return () => {
      let result = autoNumeric.getNumericString();
      if (resultType === "number") {
        result = result ? parseFloat(result) : undefined;
      }
      if (fields && name) {
        $fields[name] = result;
      }
      value = result;
      validate(result);
      dispatch("input", result);
    };
  }
</script>

<div class="input-group">
  {#if !prependDisable && format === "currency"}
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
    on:blur
  />
  <slot />
</div>
{#if $submitted}
  {#if invalid}
    <p class="invalid-tooltip">{(msgError && msgError.length > 1 && msgError[0]) || ""}</p>
  {/if}
{/if}
