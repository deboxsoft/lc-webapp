<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import AutoNumeric from "autonumeric";
  import { getFormContext } from "__@stores/form";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let options: any = {};
  export let name: string;
  export let value: any = ($fields && $fields[name]) || undefined;

  let { class: className } = $$props;

  // state
  let msgError: string[] | undefined;
  let invalid: boolean = false;
  let classes: string = "";
  let _value = value;

  $: {
    if ($fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }

  $: classes = clsx(className, "form-control input-rp");

  const useFormatCurrency = (el: HTMLInputElement, _options: any) => {
    const defaultOptions = {
      decimalPlaces: 0,
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
    const _validate = validateField(name);
    return () => {
      _validate();
      $fields[name] = parseInt(_value.replace(/\./g, ""));
      dispatcher("input", $fields[name]);
    };
  }
</script>

<style lang="scss" global>
  .input-rp {
    text-align: right;
  }
</style>

<div class="input-group">
  <div class="input-group-prepend"><span class="input-group-text">Rp</span></div>
  <input
    use:useFormatCurrency={options}
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
