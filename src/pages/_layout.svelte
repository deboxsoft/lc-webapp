<!-- routify:options preload="proximity" -->
<script>
  import { url, ready } from "@roxi/routify";
  import { onMount, tick } from "svelte";
  import Navbar from "__@root/layout/Navbar.svelte";
  import Sidebar from "__@root/layout/Sidebar.svelte";
  import SidebarMobileToggler from "__@root/layout/SidebarMobileToggler.svelte";
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
  import Brand from "__@comps/Brand.svelte";

  // context and store
  const { authenticationContext, accountingContext, loading, companyContext, configPromise } =
    createApplicationContext();
  const { toggleShowMobileSidebar } = getUIContext();
  createBreadcrumbStore({ initial: [{ title: "home", path: $url("/") }] });
  const { authenticationStore, getAccessControl } = authenticationContext;
  const { getCompany } = companyContext;

  // init loading
  let mounted = false;
  let state = "server-load";
  let accountingLoaded = false;
  let company;
  let menus = [];

  onMount(() => {
    mounted = true;
  });

  const authenticatePromise = authenticationContext.authenticate();
  const companyPromise = getCompany();
  Promise.all([configPromise, authenticatePromise, companyPromise])
    .then(() => {
      authenticateHandler($authenticationStore);
    })
    .catch((e) => {
      state = "server-error";
      $loading = false;
    });

  function loginHandler({ metadata }) {
    authenticateHandler({ metadata });
  }

  async function authenticateHandler({ metadata }) {
    try {
      const acl = getAccessControl();
      await tick();
      const grants = metadata && metadata.grants;
      if (grants) {
        acl.setGrants(grants);
        buildMenus();
      } else {
        throw new Error("authenticated-error");
      }
      state = "server-complete";
      $loading = false;
    } catch (e) {
      state = "authenticated-error";
      $loading = false;
      console.log($loading);
      console.error(e);
    }
  }

  function buildMenus() {
    state = "menus-load";
    const acl = getAccessControl();
    const grants = acl.getGrants();
    const role = $authenticationStore.profile?.session?.role;
    if (role && grants && grants[role]) {
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
            state = "error";
            console.error(e);
            $loading = false;
            $ready();
          });
      }
    }
  }
</script>

<TopLoader loading={$loading} />
{#if /(error|complete)/.test(state)}
  {#if $authenticationStore.authenticated}
    <div class="main-layout">
      <!-- Navbar -->
      <Navbar class="-background-blue" expand="md" isDark>
        <Brand />
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
    <Login bind:menus onLoginSuccess={loginHandler} />
  {/if}
{:else}
  <Loader />
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
