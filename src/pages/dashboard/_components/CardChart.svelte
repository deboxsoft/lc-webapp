<script>
  import { convertToNumber } from "__@root/utils";
  import { linear } from "svelte/easing";
  import { blur } from "svelte/transition";

  /**
   * @type{import("@deboxsoft/accounting-api").PeriodBalanceReport}
   */
  export let label;
  export let value;
  export let loading = false;
  const className = $$props.class || "";

  // periodBalanceReport.data.
  function setValueCurrency(_value) {
    return convertToNumber({ value: _value, fractionDigits: 2, thousandSeparator: ".", decimalSeparator: "," });
  }
</script>

<div class="card {className}">
  <div class="card-body">
    <div class="d-flex">
      <h3 class="font-weight-semibold mb-0">
        Rp. {value ? setValueCurrency(value) : "-"}
      </h3>
      <div class="list-icons ml-auto" />
    </div>
    <div>{label}</div>
  </div>
  {#if loading}
    <div class="card-overlay" transition:blur={{ duration: 150, easing: linear }}>
      <i class="icon-spinner9 spinner text-body" />
    </div>
  {/if}
  <slot />
</div>

<style>
  .card-overlay {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.85);
  }
</style>
