<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { redirect, layout, url, ready } from "@roxi/routify";
  import { onMount } from "svelte";
  import Navbar from "@deboxsoft/svelte-theme-limitless/navigation/Navbar.svelte";
  import Sidebar from "@deboxsoft/svelte-theme-limitless/navigation/Sidebar.svelte";
  import SidebarMobileToggler from "@deboxsoft/svelte-theme-limitless/components/SidebarMobileToggler.svelte";
  import SidebarContent from "__@root/layout/SidebarContent.svelte";
  import NavbarLeft from "__@root/layout/NavbarLeftLayout.svelte";
  import NavbarRight from "__@root/layout/NavbarRightLayout.svelte";
  import Footer from "__@root/layout/FooterLayout.svelte";
  import { createBreadcrumbStore } from "__@stores/breadcrumb";
  import { getUIContext } from "__@stores/ui";
  import { jwtStore } from "__@stores/session";
  import { accountingMenus as menus } from "__@root/stores/menus";
  import TopLoader from "__@comps/loader/TopLoader.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getAuthenticationContext } from "__@modules/users";
  import { createApplicationContext } from "__@modules/app";

  // context and store
  const { authenticationContext, accountingContext, loading } = createApplicationContext();
  const { toggleShowMobileSidebar } = getUIContext();
  createBreadcrumbStore({ initial: [{ title: "home", path: $url("/") }] });
  const { authenticationStore } = getAuthenticationContext();

  // init loading
  let loginPage = $layout.path === "/login";
  let mounted = false;
  let authenticating = true;
  let accountingLoaded = false;

  onMount(() => {
    mounted = true;
  });

  $: {
    if (!authenticating && !$authenticationStore.authenticated) {
      $redirect("./login");
    } else if (!accountingLoaded) {
      accountingLoaded = true;
      $loading = true;
      accountingContext.load().then(() => {
        $loading = false;
      });
    }
  }

  authenticationContext.authenticate($jwtStore).then(() => {
    if ($authenticationStore.authenticated) {
      accountingLoaded = true;
      accountingContext.load().then(() => {
        authenticating = false;
        $ready();
      });
    }
    authenticating = false;
  });
</script>

<TopLoader loading={$loading} />
{#if authenticating}
  <Loader />
{:else if $authenticationStore.authenticated}
  <div class="main-layout">
    <!-- Navbar -->
    <Navbar class="-background-blue" expand="md" isDark>
      <div class="navbar-brand wmin-200"><a href={$url("/")} class="d-inline-block">LC | Accounting System</a></div>
      <div class="d-md-none">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
          <i class="icon-tree5" />
        </button>
        <button
          class="navbar-toggler sidebar-mobile-main-toggle"
          type="button"
          on:click|preventDefault={toggleShowMobileSidebar}
        >
          <i class="icon-paragraph-justify3" />
        </button>
      </div>
      <div class="collapse navbar-collapse" id="navbar-mobile">
        <NavbarLeft showToggleMenu />
        <span class="ml-md-auto mr-md-3">&nbsp;</span>
        <NavbarRight />
      </div>
    </Navbar>
    <!-- close Navbar -->
    <!--  page content-->
    <div class="page-content">
      <!-- sidebar -->
      <Sidebar isLight expand="md">
        <SidebarMobileToggler onToggleShowMobileSidebar={toggleShowMobileSidebar} />
        <div class="card card-sidebar-mobile" slot="sidebar-content">
          <SidebarContent {menus} />
        </div>
      </Sidebar>
      <!-- close sidebar -->
      <slot />
    </div>
    <!-- footer -->
    <div class="footer navbar navbar-expand-lg navbar-light">
      <Footer />
    </div>
  </div>
{:else}
  <slot />
{/if}

<!-- close footer -->
<style lang="scss" global>
  .navbar.-background-blue {
    background-color: #205081;
  }

  .dbx-theme {
    .dbx-icon {
      font-size: 1rem;
    }
  }

  .sidebar {
    .dbx-icon {
      margin-right: 1.25rem;
    }
  }

  .sidebar-xs .sidebar {
    .dbx-icon {
      margin-right: 0;
    }
  }

  .navbar-nav > .nav-item > .navbar-nav-link {
    > .dbx-icon {
      font-size: 1.25rem;
    }
  }

  .main-layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }
</style>
