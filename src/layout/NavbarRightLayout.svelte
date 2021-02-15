<script lang="ts">
  import UserNavbarItem from "./UserNavbarItem.svelte";
  import { getAuthStore } from "__@stores/auth";

  const { profile } = getAuthStore();
</script>

<ul class="navbar-nav">
  {#if $profile}
    <UserNavbarItem profileName={$profile.username} />
  {/if}
</ul>
