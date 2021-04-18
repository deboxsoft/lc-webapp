<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

  export let formContextDisable: boolean = false;
  const context = (!formContextDisable && getFormContext()) || {};
  const dispatcher = createEventDispatcher();

  export let options: any = {};
  export let fields: any = context?.fields;
  export let fieldsErrors: any = context?.fieldsError;
  export let prependDisable: boolean = false;
  export let textPosition: "left" | "right" = "right";
  export let name: string;
  export let disabled: boolean = false;
  export let format: "currency" | "number" = "currency";
  export let resultType: "string" | "number" = "number";
  export let pristineValue = undefined;
  export let value: any = undefined;

  const defaultOptions = {
    decimalPlaces: format === "currency" ? 2 : 0,
    modifyValueOnWheel: false,
    digitGroupSeparator: ".",
    decimalCharacter: ","
  };

  let { class: className } = $$props;

  // state
  let msgError: string[] | undefined;
  let invalid: boolean = false;
  let classes: string = "";
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
