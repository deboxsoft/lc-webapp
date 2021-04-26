<script lang="ts">
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthenticationContext } from "__@modules/users";

  const { profileStore } = getAuthenticationContext();
</script>

<ul class="navbar-nav">
  {#if $profileStore.authenticated}
    <UserNavbarItem profileName={$profileStore.username} />
  {/if}
</ul>
