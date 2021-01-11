<script lang="ts">
  import type { UserProfile } from "@deboxsoft/svelte-theme-limitless/widget/SidebarUser";

  import { url } from "@roxi/routify";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import Accordion from "@deboxsoft/svelte-theme-limitless/components/Accordion.svelte";
  import AccordionItem from "@deboxsoft/svelte-theme-limitless/components/AccordionItem.svelte";
  import SidebarUser from "@deboxsoft/svelte-theme-limitless/widget/SidebarUser.svelte";
  import HomeIcon from "@deboxsoft/svelte-icons/HomeOutlined.svelte";
  import BookIcon from "@deboxsoft/svelte-icons/BookOutlined.svelte";
  import MenuIcon from "@deboxsoft/svelte-icons/MenuOutlined.svelte";
  import LocalLibraryOutlinedIcon from "@deboxsoft/svelte-icons/LocalLibraryOutlined.svelte";

  let collapse: boolean = false;

  export let profile: UserProfile = { name: "guest", role: "user" };
</script>

<style lang="scss" global>
  .nav-sidebar .nav-item-header > svg {
    display: none;
  }
</style>

<!-- Header -->
<div class="card-header header-elements-inline">
  <h6 class="card-title">Navigation</h6>
  <div class="header-elements">
    <div class="list-icons">
      <!-- svelte-ignore a11y-missing-content -->
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a
        href="#"
        on:click|preventDefault={() => {
          collapse = !collapse;
        }}
        target="_self"
        class="list-icons-item"
        data-action="collapse">&nbsp;</a>
    </div>
  </div>
</div>

{#if !collapse}
  <SidebarUser {profile} />
  <!-- Main navigation -->
  <div class="card-body p-0">
    <Accordion class="nav-sidebar">
      <li class="nav-item-header mt-0">
        <div class="text-uppercase font-size-xs line-height-xs">Main</div>
        <Icon component={MenuIcon} />
      </li>
      <!-- Dashboard -->
      <AccordionItem href={$url('/')}>
        <Icon component={HomeIcon} />
        <span> Dashboard</span>
      </AccordionItem>

      <!--      Data Master-->
      <AccordionItem let:expanded={_expand} target="_self">
        <Icon component={LocalLibraryOutlinedIcon} />
        <span>Master Data</span>
        <ul slot="menu" style={_expand ? 'display: block;' : ''} class="nav nav-group-sub" data-submenu-title="Akun">
          <li class="nav-item"><a class="nav-link" href={$url('/master/account')}>Akun Perkiraan</a></li>
        </ul>
      </AccordionItem>

      <!-- Jurnal -->
      <AccordionItem let:expanded={_expand} target="_self">
        <Icon component={BookIcon} />
        <span>Jurnal</span>
        <ul slot="menu" style={_expand ? 'display: block;' : ''} class="nav nav-group-sub" data-submenu-title="Jurnal">
          <li class="nav-item"><a class="nav-link" href={$url('/jurnal')}>Jurnal Umum</a></li>
        </ul>
      </AccordionItem>
    </Accordion>
  </div>
{/if}
