<!--routify:options title="Transaksi"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAuthenticationContext } from "__@modules/users";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  const applicationContext = getApplicationContext();
  setBreadcrumbContext({ path: $url("./"), title: "transaksi" });

  const auth = getAuthenticationContext();
  const accountShow = auth.getQuery().read("account").granted;
  const transactionShow = auth.getQuery().read("transaction").granted;
  const transactionOwnShow = auth.getQuery().readOwn("transaction").granted;
  const ledgerShow = auth.getQuery().read("ledger").granted;
  const bankShow = auth.getQuery().read("bank").granted;
  const balanceSheetShow = auth.getQuery("balanceSheet").read().granted;
  const statementIncomeShow = auth.getQuery("statementIncome").read().granted;
  const show = accountShow || transactionShow || transactionOwnShow || ledgerShow || bankShow;
  if (!show) {
    $goto("/access-denied");
  }
  if (balanceSheetShow || statementIncomeShow) {
    stores.createBalanceContext(applicationContext);
  }
</script>

{#if show}
  <slot />
{/if}
