<script>
  import {redirect} from "@roxi/routify";
  import {getAuthenticationContext} from "__@modules/users"

  const {authenticationStore} = getAuthenticationContext();

  $: if ($authenticationStore.authenticated) {
    $redirect($authenticationStore.metadata?.mainPage, "/dashboard")
  }
</script>
