<script>
  import { convertToNumber } from "../utils";

  export let value;
  export let spaceMinus= false;
  export let format = "rp";
  export let className = $$props.class || "";
  export let fixedNumber = format === "rp" ? 2 : 0;
</script>

<div {...$$restProps} class="cell-rp {className}" class:-minus={value < 0}>
  <!--{#if spaceMinus && (value < 0)}-->
  <!--  <div class="space-sign" />-->
  <!--{/if}-->
  {#if format === "rp"}
    <div class="sign">Rp. </div>
  {/if}
  <div class="space" />
  <div class="value">{value ? convertToNumber({ value: parseFloat(value), fractionDigits: fixedNumber }) : "-"}</div>
  {#if spaceMinus && value > 0}
    <div class="space-sign" />
  {/if}
</div>

<style lang="scss" global>
  .cell-rp {
    display: flex;
    flex: 1;
    &.-minus {
      color: red;
    }
    > .sign {
      flex: 0 0 10px;
    }
    > .space {
      flex: 1 0 auto;
    }
    > .value {
      display: block;
      flex: 0 0 auto;
    }
    > .space-sign {
      width: 20px;
      flex: 0 0 20px;
    }
  }
</style>
