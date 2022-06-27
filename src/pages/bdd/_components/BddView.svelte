<script>
  import { calcAmortization } from "@deboxsoft/accounting-api";
  import BddInfo from "./_BddInfo.svelte";
  import AccountAmountTable from "__@comps/transactions/AccountAmountTable.svelte";

  /** @type{import("@deboxsoft/accounting-api").BddDetail} */
  export let bdd;
  let totalPayment;
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
  {totalPayment}
/>
{#if bdd.paymentAccounts}
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Pembayaran</dt>
    <p class="col-sm-7 mb-0">:</p>
  </dl>
  <AccountAmountTable dataList={bdd.paymentAccounts} bind:totalPayment />
{/if}
