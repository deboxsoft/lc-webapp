<!--routify:options title="Pengikhtisaran"-->
<script lang="ts">
  import type { Account, BalanceSheet } from "@deboxsoft/accounting-api";

  import { url } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { createBalanceContext } from "__@modules/accounting";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengikhtisaran" });
  createBalanceContext();

  const addBalanceToAccountsTree = (accounts: Account[], balanceSheets: BalanceSheet[]) => {
    const _transform = (_accounts: Account[], balanceSheet: BalanceSheet): Account => {
      for (const account of _accounts) {
        if (account.id === balanceSheet.accountId) {
          return account;
        }
        if (account.children) {
          const _account = _transform(account.children, balanceSheet);
          if (_account) {
            return _account;
          }
        }
      }
    };
    balanceSheets.forEach((balanceSheet: BalanceSheet) => _transform(accounts, balanceSheet));
  };
</script>

<slot />
