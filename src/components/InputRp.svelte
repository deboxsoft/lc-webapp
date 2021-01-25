<script lang="ts">
  import type { FieldStore } from "@deboxsoft/svelte-forms";

  import { getContext } from "@deboxsoft/svelte-forms/Form.svelte";
  import { FormStore } from "@deboxsoft/svelte-forms";
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { createEventDispatcher, tick } from "svelte";
  import { useMask } from "@deboxsoft/svelte-core";

  export let value;
  export let name;
  export let fieldStore: FieldStore | undefined = undefined;
  let { class: className } = $$props;

  // formStore handler
  const context = getContext();
  const formStore: FormStore | undefined = context?.formStore;
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
    if ($_fieldStore.touched) {
      isValid = $_fieldStore?.errors?.length === 0;
      isInvalid = $_fieldStore?.errors?.length > 0;
    }
  }

  // state
  let classes;
  let options = {
    mask: Number, // enable number mask

    // other options are optional with defaults below
    scale: 4, // digits after point, 0 for integers
    signed: true, // disallow negative
    thousandsSeparator: ",", // any single char
    padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
    normalizeZeros: true, // appends or removes zeros at ends
    radix: ",", // fractional delimiter
    mapToRadix: ["."] // symbols to process as radix
  };

  $: classes = clsx(className, "form-control input-rp");

  // handler
  function createBlurHandler() {
    const handleBlur = formStore?.handleBlur(name);
    return (e) => {
      handleBlur() && handleBlur();
      dispatch("blur", e);
    };
  }

  function acceptHandler({ detail: imask }) {
    value = imask.unmaskedValue;
    tick().then(() => {
      imask.typedValue = value;
      formStore?.handleInput(name);
    });
  }
</script>

<style lang="scss" global>
  .input-rp {
    direction: rtl;
  }
</style>

<div class="input-group">
  <div class="input-group-prepend"><span class="input-group-text">Rp</span></div>
  <input
    use:useMask={options}
    {...$$restProps}
    {name}
    class={classes}
    on:click
    on:keydown
    on:input
    on:change
    on:search
    on:focus
    on:blur
    on:invalid
    on:accept={acceptHandler}
    on:accept
    on:complete />
</div>
