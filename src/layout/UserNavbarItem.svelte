<script lang="ts">
  import Dropdown from "__@comps/Dropdown.svelte";

  export let avatarSrc: string = "/images/profile.png";
  export let profileName: string = "guest";
  let triggerElement: HTMLElement;
</script>

<Dropdown class="dropdown-user" isNavItem menuClass="dropdown-menu-right" {triggerElement} placement="bottom-end">
  <a
    href="/#"
    bind:this={triggerElement}
    on:click|preventDefault={() => {}}
    class="dropdown-toggle navbar-flex align-items-center navbar-nav-link"
    target="_self">
    <img src={avatarSrc} class="rounded-circle mr-2" height="34" alt="" />
    <span>{profileName}</span>
  </a>
  <!-- menu -->
  <div slot="dropdown-menu">
    <a href="/#" class="dropdown-item"><i class="icon-user-plus" /> My profile</a>
    <a href="/#" class="dropdown-item"><i class="icon-cog5" /> Account settings</a>
    <a href="/#" class="dropdown-item"><i class="icon-switch2" /> Logout</a>
  </div>
</Dropdown>
