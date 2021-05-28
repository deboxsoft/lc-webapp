<!--routify:options title="Pengikhtisaran"-->
<script lang="ts">
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const auth = getAuthenticationContext();
  const applicationContext = getApplicationContext();
  const statementIncomeShow = auth.getQuery().read("statementIncome").granted;
  const balanceSheetShow = auth.getQuery().read("balanceSheet").granted;
  const show = statementIncomeShow || balanceSheetShow;
  if (!show) {
    $goto("/access-denied");
  }

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengikhtisaran" });
  stores.createBalanceContext(applicationContext);
</script>

<slot />
