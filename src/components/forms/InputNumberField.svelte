<script>
  import { clsx } from "@deboxsoft/module-client";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "../../stores/form";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  const { fields, fieldsErrors, validateField, submitted } = getFormContext();
  const dispatch = createEventDispatcher();

  export let options = {};
  export let name;
  export let prependDisable = false;
  export let textPosition = "right";
  export let disabled = false;
  export let format = "currency";
  export let resultType = "number";
  export let pristineValue = undefined;
  export let value = pristineValue;
  export let maximumValue = "10000000000000";
  export let minimumValue = "-10000000000000";

  const defaultOptions = {
    decimalPlaces: format === "currency" ? 2 : 0,
    modifyValueOnWheel: false,
    digitGroupSeparator: ".",
    decimalCharacter: ",",
    maximumValue,
    minimumValue
  };

  let { class: className } = $$props;

  // state
  let msgError;
  let invalid = false;
  let classes = "";
  let autoNumeric;
  let inputEl;

  $: {
    if ($fields && name && $fields[name] && !value) {
      value = $fields[name];
    }
  }

  $: {
    if (format === "number") {
      options = { ...AutoNumeric.getPredefinedOptions().integerPos, ...options };
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
    fields && name && autoNumeric && !Number.isNaN(value) && value !== $fields[name] && autoNumeric.set($fields[name]);
  }

  $: classes = clsx(className, "form-control", textPosition === "right" && "text-right");

  onMount(() => {
    autoNumeric = new AutoNumeric(inputEl, { ...defaultOptions, ...options });
    !Number.isNaN(value) && autoNumeric.set(value);
  });

  onDestroy(() => {
    autoNumeric.wipe();
  });

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
