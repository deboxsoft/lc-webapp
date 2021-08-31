<script>
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import NotivicationNavbarItem from "./NotivicationNavbarItem.svelte";

  const { authenticationStore } = getAuthenticationContext();
</script>

<ul class="navbar-nav">
  <li class="nav-item"></li>
  {#if $authenticationStore.authenticated}
    <NotivicationNavbarItem />
    <UserNavbarItem profileName={$authenticationStore.username} />
  {/if}
</ul>
