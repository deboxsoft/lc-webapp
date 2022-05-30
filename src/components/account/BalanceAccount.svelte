<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { accountStore, getAccount } = stores.getAccountContext();
  const { getFixedBalanceAccount } = stores.getBalanceContext();
  export let id = undefined;
  /**
   * @type {undefined | Function}
   */
  export let value = undefined;

  let _value;
  getFixedBalanceAccount(id, {}).then((_) => {
    if (typeof value === "function") {
      value = value(_);
    } else {
      value = _;
    }
  });
</script>

<CellNumber {value} {...$$restProps} />
