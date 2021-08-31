<script>
  import { getAuthenticationContext } from "__@modules/users";
  import { redirect } from "@roxi/routify";
  const authContext = getAuthenticationContext();
  const statementIncomeShow = auth.getQuery().read("statementIncome").granted;
  const balanceSheetShow = auth.getQuery().read("balanceSheet").granted;
  if (statementIncomeShow) {
    $redirect("./laba-rugi");
  } else if (balanceSheetShow) {
    $redirect("./neraca");
  } else {
    $redirect("/access-denied")
  }
</script>
