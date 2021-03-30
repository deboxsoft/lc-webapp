<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";

  export let formContextDisable: boolean = false;
  const context = (!formContextDisable && getFormContext()) || {};
  const dispatcher = createEventDispatcher();

  export let options: any = {};
  export let fields: any = context.fields;
  export let fieldsErrors: any = context.fieldsError;
  export let prependDisable: boolean = false;
  export let textPosition: "left" | "right" = "right";
  export let name: string;
  export let format: "currency" | "number" = "currency";
  export let resultType: "string" | "number" = "number";
  export let value: any = ($fields && $fields[name]) || undefined;

  let { class: className } = $$props;

  // state
  let msgError: string[] | undefined;
  let invalid: boolean = false;
  let classes: string = "";
  let submitted = context.submitted
  let _value = value;

  $: {
    if (format === "number") {
      options = { ...AutoNumeric.getPredefinedOptions().integerPos, ...options }
    }
  }

  $: {
    if (!formContextDisable) {
      if ($fieldsErrors && $fieldsErrors[name]) {
        invalid = true;
        msgError = $fieldsErrors[name];
      } else {
        invalid = false;
      }
    }
  }

  $: classes = clsx(className, "form-control", textPosition === "right" && "text-right");

  const useFormatCurrency = (el: HTMLInputElement, _options: any) => {
    const defaultOptions = {
      decimalPlaces: format === "currency" ? 2 : 0,
      modifyValueOnWheel: false,
      digitGroupSeparator: ".",
      decimalCharacter: ","
    };
    const numEl = new AutoNumeric(el, { ...defaultOptions, ..._options });
    return {
      update: (_options: any) => {
        numEl.update(options);
        return {
          destroy() {
            numEl.wipe();
          }
        };
      }
    };
  };

  function createInputHandler() {
    const _validate = context.validateField ? context.validateField(name): (() => {});
    return () => {
      let result = _value.replace(/\./g, "");
      if (resultType === "number") {
        result = parseFloat(result.replace(/,/g, "."));
      }
      if ($fields) {
        $fields[name] = result;
      }
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
    use:useFormatCurrency={options}
    type="text"
    {...$$restProps}
    {name}
    bind:value={_value}
    class={classes}
    on:input={createInputHandler()}
    on:click
    on:keydown
    on:change
    on:focus
    on:blur />
</div>
{#if $submitted}
  {#if invalid}
    <p class="invalid-tooltip">{(msgError && msgError.length > 1 && msgError[0]) || ''}</p>
  {/if}
{/if}
