<script>
  import TransactionList from "__@comps/transactions/TransactionList.svelte";
  import { calcAmortization } from "@deboxsoft/accounting-api";
  import BddInfo from "./_BddInfo.svelte";

  /** @type{import("@deboxsoft/accounting-api").BddDetail} */
  export let bdd;
  const transaction = bdd.transaction;
  const { total, tax, rate, bookValue, amortizationAccumulation, amortizationRemaining, amortizationAmount } =
    calcAmortization(bdd);
</script>

<BddInfo
  {bdd}
  {amortizationAccumulation}
  {amortizationAmount}
  {amortizationRemaining}
  {tax}
  {bookValue}
  {rate}
  {total}
/>
{#if transaction}
  <TransactionList {transaction} />
{/if}
