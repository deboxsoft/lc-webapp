<!--routify:options title="Transaksi"-->
<script>
  import { url, goto } from "@roxi/routify";
  import { getAuthenticationContext } from "__@modules/users";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "transaksi" });

  const auth = getAuthenticationContext();
  const accountShow = auth.getQuery().read("account").granted;
  const transactionShow = auth.getQuery().read("transaction").granted;
  const ledgerShow = auth.getQuery().read("ledger").granted;
  const bankShow = auth.getQuery().read("bank").granted;
  const show = accountShow || transactionShow || ledgerShow || bankShow;
  if (!show) {
    $goto("/access-denied")
  }
</script>

{#if show}
  <slot />
{/if}
