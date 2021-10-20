<!--routify:options title="Menu"-->
<script>
  import { getAuthenticationContext } from "__@modules/users";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import MenuCard from "__@root/pages/bdd/_components/MenuCard.svelte";
  const auth = getAuthenticationContext();
  const ledgerShow = auth.getQuery("ledger").read().granted;
  const balanceSheetShow = auth.getQuery("balanceSheet").read().granted;
  const statementIncomeShow = auth.getQuery("statementIncome").read().granted;
</script>

<PageLayout>
  <div class="d-flex flex-wrap">
    <MenuCard show={ledgerShow} label="Trial Balance" path="./trial-balance" iconClass="icon-table2" />
    <MenuCard show={ledgerShow} label="Buku Besar" path="./buku-besar" iconClass="icon-file-spreadsheet" />
    <MenuCard
      show={statementIncomeShow}
      label="Laba Rugi Perkiraan"
      path="./laba-rugi-perkiraan"
      iconClass="icon-stack"
    />
    <MenuCard show={statementIncomeShow} label="Laba Rugi" path="./laba-rugi" iconClass="icon-file-text2" />
    <MenuCard
      show={balanceSheetShow}
      label="Neraca Perkiraan"
      path="./neraca-perkiraan"
      iconClass="icon-file-presentation"
    />
    <MenuCard show={balanceSheetShow} label="Neraca" path="./neraca" iconClass="icon-file-stats" />
  </div>
</PageLayout>
