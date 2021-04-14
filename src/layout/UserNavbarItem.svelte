<script lang="ts">
  import Dropdown from "__@comps/Dropdown.svelte";
  import { goto, route } from "@roxi/routify";

  export let avatarSrc: string = "/images/profile.png";
  export let profileName: string = "guest";
  let triggerElement: HTMLElement;

  function passwordHandler() {
    $goto("/settings/change-password", { backUrl: $route.shortPath }, true, true)
  }

  function profileHandler() {
    $goto("/settings/profile", { backUrl: $route.shortPath }, true, true)
  }

  function userHandler() {
    $goto("/settings/users", { backUrl: $route.shortPath }, true, true)
  }

  function settingsHandler() {
    $goto("/settings/accounting", { backUrl: $route.shortPath }, true, true)
  }
</script>

<Dropdown class="dropdown-user" isNavItem let:toggle let:toggleClass>
  <a
    href="/#"
    on:click|preventDefault={toggle}
    class="{toggleClass} navbar-flex align-items-center navbar-nav-link"
    target="_self"
  >
    <img src={avatarSrc} class="rounded-circle mr-2" height="34" alt="" />
    <span>{profileName}</span>
  </a>
  <!-- menu -->
  <div slot="menu">
    <a href="/#" class="dropdown-item" on:click|preventDefault={profileHandler}><i class="far fa-user" />Pengaturan Profile</a>
    <a href="/#" class="dropdown-item" on:click|preventDefault={passwordHandler}><i class="icon-lock5" />Ganti Password</a>
    <div class="dropdown-divider" />
    <a href="/#" class="dropdown-item" on:click|preventDefault={userHandler}><i class="icon-people" />Pengelolaan User</a>
    <a href="/#" class="dropdown-item" on:click|preventDefault={settingsHandler}><i class="icon-cog5" />Pengaturan Aplikasi</a>
    <a href="/#" class="dropdown-item"><i class="icon-switch2" /> Logout</a>
  </div>
</Dropdown>
