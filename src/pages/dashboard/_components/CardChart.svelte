<script>
  import { formatCurrency } from "__@root/utils";
  import { linear } from "svelte/easing";
  import { blur } from "svelte/transition";

  /**
   * @type{import("@deboxsoft/accounting-api").PeriodBalanceReport}
   */
  export let label;
  export let value;
  export let loading = false;
  const className = $$props.class || "";

  let _val, nominal;

  $: {
    if (isFinite(value)) {
      changeValue(value);
    }
  }

  function changeValue(to, { duration = 1500, from = 0 } = {}) {
    const range = to - from;
    const minTimer = 50;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(minTimer, stepTime);
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;
    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      _val = to - remaining * range;
      if (_val === to) {
        clearInterval(timer);
      }
      nominal = formatCurrency(_val);
    };
    timer = setInterval(run, stepTime);
  }
</script>

<div class="card {className}">
  <div class="card-body">
    <div class="d-flex">
      <h3 class="font-weight-semibold mb-0">
        {nominal ? nominal : "Rp. -"}
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
