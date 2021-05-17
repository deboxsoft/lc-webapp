<!--routify:options title="Pengikhtisaran"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createBalanceContext } from "__@modules/accounting";
  import { getAuthenticationContext } from "__@modules/users";

  const auth = getAuthenticationContext();
  const statementIncomeShow = auth.getQuery().read("statementIncome").granted;
  const balanceSheetShow = auth.getQuery().read("balanceSheet").granted;
  const show = statementIncomeShow || balanceSheetShow;
  if (!show) {
    $goto("/access-denied");
  }

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengikhtisaran" });
  createBalanceContext();
</script>

<slot />
