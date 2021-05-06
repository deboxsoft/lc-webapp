<script lang="ts">
  import { url, isActive } from "@roxi/routify";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import Accordion from "@deboxsoft/svelte-theme-limitless/components/Accordion.svelte";
  import AccordionItem from "@deboxsoft/svelte-theme-limitless/components/AccordionItem.svelte";
  import SidebarUser from "@deboxsoft/svelte-theme-limitless/widget/SidebarUser.svelte";
  import HomeIcon from "__@comps/icons/Home.svelte";
  import MenuIcon from "@deboxsoft/svelte-icons/MenuOutlined.svelte";
  import { getAuthenticationContext } from "__@modules/users";

  const { authenticationStore } = getAuthenticationContext();
  let scrollbar;
  let elRef;

  export let menus;

  let collapse: boolean = false;
</script>

<!-- Header -->
<div class="card-header header-elements-inline">
  <h6 class="card-title">Navigation</h6>
  <div class="header-elements">
    <div class="list-icons">
      <!-- svelte-ignore a11y-missing-content -->
      <!-- svelte-ignore a11y-invalid-attribute -->
      <!--      <a-->
      <!--        href="#"-->
      <!--        on:click|preventDefault={() => {-->
      <!--          collapse = !collapse;-->
      <!--        }}-->
      <!--        target="_self"-->
      <!--        class="list-icons-item"-->
      <!--        data-action="collapse">&nbsp;</a>-->
    </div>
  </div>
</div>

{#if !collapse}
  {#if $authenticationStore.authenticated}
<!--    <SidebarUser-->
<!--      profile={{-->
<!--        name: $authenticationStore.profile.name,-->
<!--        role: $authenticationStore.profile.role ? $authenticationStore.profile.role[0] : "",-->
<!--        avatar: $authenticationStore.avatar || ""-->
<!--      }}-->
<!--    />-->
  {/if}
  <!-- Main navigation -->
  <div class="card-body p-0">
    <Accordion class="nav-sidebar">
      <li class="nav-item-header mt-0">
        <div class="text-uppercase font-size-xs line-height-xs">Main</div>
        <Icon component={MenuIcon} />
      </li>
      <!-- Dashboard -->
      <!--      <AccordionItem href={$url("/")}>-->
      <!--        <Icon component={HomeIcon} />-->
      <!--        <span> Dashboard</span>-->
      <!--      </AccordionItem>-->

      {#each menus as item}
        <AccordionItem
          expanded={!!item.children && $isActive(item.url)}
          let:expanded={_expand}
          toggleClass={$isActive(item.url) && "active"}
          target={(item.children && !item.url) && "_self" || undefined}
          hasChildren={!!item.children}
          href={(!item.children && item.url) || undefined}
        >
          {#if item.icon && typeof item.icon === "string"}
            <i class={item.icon} />
          {:else if item.icon}
            <Icon component={item.icon} />
          {/if}
          <span>{item.label}</span>
          <ul
            slot="menu"
            style={_expand ? "display: block;" : ""}
            class="nav nav-group-sub"
            data-submenu-title={item.label}
          >
            {#each item.children as subItem}
              <li class="nav-item">
                <a class="nav-link" class:active={$isActive(subItem.url)} href={$url(subItem.url)}>
                  {#if subItem.icon && typeof subItem.icon === "string"}
                    <i class={subItem.icon} />
                  {:else if subItem.icon}
                    <Icon component={subItem.icon} />
                  {/if}
                  <span>{subItem.label}</span></a
                >
              </li>
            {/each}
          </ul>
        </AccordionItem>
      {/each}
    </Accordion>
  </div>
{/if}

<style lang="scss" global>
  .nav-sidebar .nav-item-header > svg {
    display: none;
  }

  .sidebar-content {
    //height: calc(100vh - 70px);
    //overflow-y: scroll !important;
  }
</style>
