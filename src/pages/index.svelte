<script lang="ts">
  import {redirect} from "@roxi/routify";
  import {getAuthenticationContext} from "__@modules/users"

  const {authenticationStore} = getAuthenticationContext();

  $: if ($authenticationStore.authenticated) {
    $redirect("/transaksi/akun-perkiraan")
  }
</script>
