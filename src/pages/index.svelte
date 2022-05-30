<script>
  import { redirect } from "@roxi/routify";
  import { getAuthenticationContext } from "__@modules/users";
  import { createAclContext } from "__@root/utils/acl-utils";

  const authContext = getAuthenticationContext();
  const { authenticationStore } = authContext;
  const { readGranted } = createAclContext({
    authContext,
    resource: "dashboard"
  });
  $: if ($authenticationStore.authenticated) {
    let redirectPage = "/home";
    if (readGranted) {
      redirectPage = "/dashboard";
    }
    const mainPage = $authenticationStore.metadata?.mainPage;
    redirectPage = mainPage && mainPage !== "/" ? mainPage : redirectPage;
    $redirect(redirectPage);
  }
</script>
