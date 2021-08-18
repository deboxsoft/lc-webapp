<script>
  import { getAuthenticationContext } from "__@modules/users";
  import { redirect } from "@roxi/routify";
  const authContext = getAuthenticationContext();
  const accountShow = authContext.getQuery().read("account").granted;
  const programShow = authContext.getQuery().read("program").granted;
  if (accountShow) {
    $redirect("./akun-perkiraan");
  } else if (programShow) {
    $redirect("./program");
  } else {
    $redirect("/access-denied")
  }
</script>