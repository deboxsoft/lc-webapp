<script>
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import NotificationNavbarItem from "./NotificationNavbarItem.svelte";

  const className = $$props.class || "";

  const { authenticationStore } = getAuthenticationContext();
</script>

<ul class="navbar-nav {className}">
  <li class="nav-item" />
  {#if $authenticationStore.authenticated}
    <NotificationNavbarItem />
    <UserNavbarItem profileName={$authenticationStore.username} />
  {/if}
</ul>
