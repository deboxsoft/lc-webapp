<script lang="ts">
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthenticationContext } from "__@modules/users";

  const { authenticationStore } = getAuthenticationContext();
</script>

<ul class="navbar-nav">
  {#if $authenticationStore.authenticated}
    <UserNavbarItem profileName={$authenticationStore.username} />
  {/if}
</ul>
