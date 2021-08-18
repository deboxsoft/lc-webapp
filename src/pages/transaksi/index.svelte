<script>
  import { getAuthenticationContext } from "__@modules/users";
  import { redirect } from "@roxi/routify";
  const authContext = getAuthenticationContext();
  const cashierShow = authContext.getQuery().read("cashier").granted;
  const transactionShow = authContext.getQuery().read("transaction").granted;
  const ledgerShow = authContext.getQuery().read("ledger").granted;
  const bankShow = authContext.getQuery().read("bank").granted;
  const statementIncomeShow = auth.getQuery().read("statementIncome").granted;
  const balanceSheetShow = auth.getQuery().read("balanceSheet").granted;
  if (transactionShow) {
    $redirect("./jurnal");
  } else if (bankShow) {
    $redirect("./rekonsiliasi-bank");
  } else if (cashierShow) {
    $redirect("./kasir");
  } else if (ledgerShow) {
    $redirect("./buku-besar");
  } else if (statementIncomeShow) {
    $redirect("./laba-rugi");
  } else if (balanceSheetShow) {
    $redirect("./neraca");
  } else {
    $redirect("/access-denied")
  }
</script>

