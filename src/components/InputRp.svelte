<script lang="ts">

  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { createEventDispatcher, tick } from "svelte";
  import { useMask } from "@deboxsoft/svelte-core";

  export let value: any = undefined;
  export let signed: boolean = true;
  export let name: string;
  export let errors = undefined;

  let { class: className } = $$props;

  let msgError;
  let isValid: boolean = false;
  let _key;
  let dispatch = createEventDispatcher();

  // state
  let classes;
  let options = {
    mask: Number, // enable number mask

    signed, // disallow negative
    thousandsSeparator: ",", // any single char
    radix: ",", // fractional delimiter
    mapToRadix: ["."] // s
    // ymbols to process as radix
  };

  $: classes = clsx(className, "form-control input-rp");

  // handler
  function createBlurHandler() {
    return (e) => {
      handleBlur && handleBlur();
      dispatch("blur", e);
    };
  }

  function acceptHandler(e) {
    const imask = e.detail
    //value = parseInt(imask.unmaskedValue);
    tick().then(() => {
      //imask.typedValue = value;
      // dispatch("input", value)
    });
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
    use:useMask={options}
    {...$$restProps}
    {value}
    {name}
    class={classes}
    on:click
    on:keydown
    on:change
    on:focus
    on:blur
    on:invalid
    on:accept={acceptHandler}
    on:complete />
</div>
