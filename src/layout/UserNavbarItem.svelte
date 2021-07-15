<script>
  import { tick } from "svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import Avatar from "__@comps/Avatar.svelte";
  import { goto, route } from "@roxi/routify";
  import { getAuthenticationContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";

  const { authenticationStore, logout } = getAuthenticationContext();
  const { loading } = getApplicationContext();
  $: profileName = $authenticationStore.profile.displayName;
  let triggerElement: HTMLElement;

  async function logoutHandler() {
    $loading = true;
    await logout();
    await tick();
    $loading = false;
  }

  function passwordHandler() {
    $goto("/settings/change-password", { backUrl: $route.shortPath }, true, true);
  }

  function profileHandler() {
    $goto("/settings/profile", { backUrl: $route.shortPath }, true, true);
  }
</script>

<Dropdown class="dropdown-user" nav direction="end">
  <DropdownToggle class="d-flex align-items-center navbar-nav-link" tag="div">
    <Avatar size="34px" class="mr-2" />
    <!--    <img src={avatarSrc} class="rounded-circle mr-2" height="34" alt="" />-->
    <span>{profileName}</span>
  </DropdownToggle>
  <!-- menu -->
  <svelte:fragment slot="menu">
    <!--    <a href="/#" class="dropdown-item" on:click|preventDefault={profileHandler}><i class="far fa-user" />Pengaturan Profile</a>-->
    <!--    <a href="/#" class="dropdown-item" on:click|preventDefault={passwordHandler}><i class="icon-lock5" />Ganti Password</a>-->
    <!--    <div class="dropdown-divider" />-->
    <a href="/#" class="dropdown-item" on:click|preventDefault={logoutHandler}><i class="icon-switch2" /> Logout</a>
  </svelte:fragment>
</Dropdown>
