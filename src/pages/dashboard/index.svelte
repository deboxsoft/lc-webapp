<!--routify:options title="dashboard"-->
<script>
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import MenuCard from "__@root/pages/bdd/_components/MenuCard.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { get } from "svelte/store";

  const auth = getAuthenticationContext();
  const profile = get(auth.authenticationStore);
  const accountShow = auth.getQuery("account").read().granted;
  const programShow = auth.getQuery("program").read().granted;
  const transactionShow = auth.getQuery("transaction").read().granted;
  const transactionOwnShow = auth.getQuery("transaction").readOwn().granted;
  const ledgerShow = auth.getQuery("ledger").read().granted;
  const bankShow = auth.getQuery("bank").read().granted;
  const cashierShow = auth.getQuery("cashier").read().granted;
  const balanceSheetShow = auth.getQuery("balanceSheet").read().granted;
  const statementIncomeShow = auth.getQuery("statementIncome").read().granted;
  const inventoryShow = auth.getQuery("inventory").read().granted;
  const bddShow = auth.getQuery("bdd").read().granted;
  const stockShow = auth.getQuery("stock").read().granted;
  const userShow = auth.getQuery("user").read().granted;
  const settingShow = auth.getQuery("setting").read().granted;
  const reportShow = ledgerShow || statementIncomeShow || balanceSheetShow;
</script>

<PageLayout>
  <div class="d-flex flex-wrap">
    <MenuCard show={transactionShow} label="Jurnal" path="/transaksi/jurnal" iconClass="icon-loop"  />
    <MenuCard show={cashierShow} label="Kasir" path="/transaksi/cashier" iconClass="icon-cash2" />
    <MenuCard show={bankShow} label="Bank" path="/transaksi/bank" iconClass="icon-cash4" />
    <MenuCard show={stockShow} label="Persediaan" path="/persediaan/home" iconClass="icon-archive" />
    <MenuCard show={inventoryShow} label="Aktiva Tetap" path="/aktiva-tetap/home" iconClass="icon-file-check" />
    <MenuCard show={bddShow} label="BDD" path="/bdd/home" iconClass="icon-library2" />
    <MenuCard show={reportShow} label="Laporan" path="/laporan" iconClass="icon-stack-text" />
    <MenuCard show={userShow} label="Users" path="/users" iconClass="icon-users4" />
    <MenuCard show={settingShow} label="Settings" path="/settings" iconClass="icon-cog3" />
    <MenuCard show={profile.authenticated} label="Profile" path="/profile" iconClass="icon-profile"/>
  </div>
</PageLayout>
