<script lang="ts">
  import {convertToRp} from "__@root/utils"

  export let value;
  export let spaceMinus: boolean = false;
</script>
<style lang="scss" global>
  .cell-rp {
    display: flex;
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
<div class="cell-rp" class:-minus={value < 0}>
  <!--{#if spaceMinus && (value < 0)}-->
  <!--  <div class="space-sign" />-->
  <!--{/if}-->
  <div class="sign">Rp.</div>
  <div class="space" />
  <div class="value">{value ? convertToRp(parseInt(value)) : "-"}</div>
  {#if spaceMinus && (value > 0)}
    <div class="space-sign" />
  {/if}
</div>
