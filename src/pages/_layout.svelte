<!-- routify:options preload="proximity" -->
<script lang="ts">
  import { url, ready } from "@roxi/routify";
  import initial from "initials";
  import { onMount } from "svelte";
  import Navbar from "@deboxsoft/svelte-theme-limitless/navigation/Navbar.svelte";
  import Sidebar from "@deboxsoft/svelte-theme-limitless/navigation/Sidebar.svelte";
  import SidebarMobileToggler from "@deboxsoft/svelte-theme-limitless/components/SidebarMobileToggler.svelte";
  import SidebarContent from "__@root/layout/SidebarContent.svelte";
  import NavbarLeft from "__@root/layout/NavbarLeftLayout.svelte";
  import NavbarRight from "__@root/layout/NavbarRightLayout.svelte";
  import Login from "__@root/layout/Login.svelte";
  import Footer from "__@root/layout/FooterLayout.svelte";
  import { createBreadcrumbStore } from "__@stores/breadcrumb";
  import { getUIContext } from "__@stores/ui";
  import { getMenus } from "__@root/stores/menus";
  import TopLoader from "__@comps/loader/TopLoader.svelte";
  import Loader from "__@comps/loader/Loader.svelte";
  import { createApplicationContext } from "__@modules/app";

  // context and store
  const {
    authenticationContext,
    accountingContext,
    loading,
    companyContext,
    configPromise
  } = createApplicationContext();
  const { toggleShowMobileSidebar } = getUIContext();
  createBreadcrumbStore({ initial: [{ title: "home", path: $url("/") }] });
  const { authenticationStore, getAccessControl } = authenticationContext;
  const { companyStore, getCompany } = companyContext;

  // init loading
  let mounted = false;
  let state = "server-load";
  let accountingLoaded = false;
  let company;
  let menus = [];

  $: console.log(`state : ${state}`);

  onMount(() => {
    mounted = true;
  });

  $: {
    if (state === "server-complete" && $authenticationStore.authenticated) {
      state = "menus-load";
      menus = getMenus(authenticationContext);
      state = "menus-complete";
      if (!accountingLoaded) {
        state = "accounting-load";
        accountingLoaded = true;
        accountingContext
          .load()
          .then(() => {
            state = "accounting-complete";
            $loading = false;
            $ready();
            state = "complete";
          })
          .catch((e) => {
            state = "accounting-error";
            console.error(e);
            $loading = false;
            $ready();
          });
      }
    }
  }
  const authenticatePromise = authenticationContext.authenticate();
  const companyPromise = getCompany();
  Promise.all([configPromise, authenticatePromise, companyPromise])
    .then(() => {
      state = "server-complete";
      ("response promise");
    })
    .catch((e) => {
      state = "error";
      $loading = false;
    });
</script>

<TopLoader loading={$loading} />
{#if state !== "complete"}
  <Loader />
{:else if $authenticationStore.authenticated}
  <div class="main-layout">
    <!-- Navbar -->
    <Navbar class="-background-blue" expand="md" isDark>
      <div class="navbar-brand wmin-200">
        <a href={$url("/")} class="d-inline-block"
          >{initial($companyStore.name)?.toUpperCase() || "LC"} | {$companyStore.unit || ""}</a
        >
      </div>
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
  <Login />
{/if}

<!-- close footer -->
<style lang="scss" global>
  html {
    scroll-behavior: smooth;
  }
  #debox-app {
    display: flex;
    flex: 1;
  }

  .navbar.-background-blue {
    background-color: #205081;
  }

  .dbx-theme {
    .dbx-icon {
      font-size: 1rem;
      &.mr-3 {
        margin-right: 1rem !important;
      }

      svg {
        height: 16px;
        width: 16px;
        margin: auto 1rem auto 0;
      }

      &.icon-sm svg {
        height: 8px;
        width: 8px;
      }
    }

    .table {
      .list-icons-item .dbx-icon {
        width: 16px;
        height: 16px;
      }

      tr .-menu-list {
        text-align: center;
        width: 30px;
        padding: 0;
      }
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: calc(2.25rem + 2px);
      height: calc(2.25rem + 2px);

      > i {
        position: static;
        min-width: 1rem;
      }
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
    flex: 1;
  }

  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }
</style>
