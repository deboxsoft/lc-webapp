<script>
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import NotificationNavbarItem from "./NotificationNavbarItem.svelte";

  const { authenticationStore } = getAuthenticationContext();
</script>

<ul class="navbar-nav">
  <li class="nav-item" />
  {#if $authenticationStore.authenticated}
    <NotificationNavbarItem />
    <UserNavbarItem profileName={$authenticationStore.username} />
  {/if}
</ul>
