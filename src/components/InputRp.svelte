<script lang="ts">
  import type { FieldStore } from "@deboxsoft/svelte-forms";
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import { getContext } from "@deboxsoft/svelte-forms/Form.svelte";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { createEventDispatcher, tick } from "svelte";
  import { useMask } from "@deboxsoft/svelte-core";

  const context = getContext();
  export let value: any = undefined;
  export let name: string;
  export let errors = undefined;
  export let touched = false;
  export let validate = undefined;
  export let fieldStore: FieldStore | null = null;
  export let formStoreDisable: boolean = false;
  export let formStore: FormStore | null = !formStoreDisable && context?.formStore;
  let { class: className } = $$props;

  // formStore handler
  let isValid: boolean = false;
  let isInvalid: boolean = false;
  let _fieldStore: FieldStore;
  let dispatch = createEventDispatcher();

  // register fieldState to fieldStore
  if (fieldStore) {
    formStore?.addFieldStore(name, fieldStore);
  } else {
    formStore?.addField(name, { value, errors, touched, validate });
  }
  $: _fieldStore = fieldStore || formStore?.getFieldStore(name);
  $: {
    if ($_fieldStore?.touched) {
      isValid = $_fieldStore?.errors?.length === 0;
      isInvalid = $_fieldStore?.errors?.length > 0;
    }
  }

  // state
  let classes;
  let options = {
    mask: Number, // enable number mask

    signed: false, // disallow negative
    thousandsSeparator: ",", // any single char
    radix: ",", // fractional delimiter
    mapToRadix: ["."] // symbols to process as radix
  };

  $: classes = clsx(className, "form-control input-rp");

  // handler
  function createBlurHandler() {
    const handleBlur = formStore?.handleBlur(name);
    return (e) => {
      handleBlur && handleBlur();
      dispatch("blur", e);
    };
  }

  function acceptHandler({ detail: imask }) {
    value = parseInt(imask.unmaskedValue);
    tick().then(() => {
      imask.typedValue = value;
      formStore?.handleInput(name);
    });
  }
</script>

<div class="input-group">
  <div class="input-group-prepend"><span class="input-group-text">Rp</span></div>
  <input
    use:useMask={options}
    {...$$restProps}
    {value}
    {name}
    class={classes}
    on:click
    on:keydown
    on:input
    on:change
    on:focus
    on:blur
    on:invalid
    on:accept={acceptHandler}
    on:accept
    on:complete />
</div>
