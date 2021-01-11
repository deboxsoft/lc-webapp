<script>
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { tick } from "svelte";
  import { useMask } from "@deboxsoft/svelte-core";

  export let value;

  let { class: className } = $$props;
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

  function accept({ detail: imask }) {
    value = imask.unmaskedValue;
    tick().then(() => {
      imask.typedValue = value;
    });
  }

  $: classes = clsx(className, "form-control input-rp");
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
    class={classes}
    on:click
    on:keydown
    on:input
    on:change
    on:search
    on:focus
    on:blur
    on:invalid
    on:accept={accept}
    on:accept
    on:complete />
</div>
