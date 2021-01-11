<!-- routify:options preload="proximity" -->
<script lang="ts">
  import Navbar from "@deboxsoft/svelte-theme-limitless/navigation/Navbar.svelte";
  import Sidebar from "@deboxsoft/svelte-theme-limitless/navigation/Sidebar.svelte";
  import SidebarMobileToggler from "@deboxsoft/svelte-theme-limitless/components/SidebarMobileToggler.svelte";
  import SidebarContent from "__@root/layout/SidebarContent.svelte";
  import NavbarLeft from "__@root/layout/NavbarLeftLayout.svelte";
  import NavbarRight from "__@root/layout/NavbarRightLayout.svelte";
  import Footer from "__@root/layout/FooterLayout.svelte";
  import { redirect, layout, url } from "@roxi/routify";
  import { authStore } from "__@root/store/auth";
  import { getContext } from "__@root/store/ui";
  import PageLayout from "../layout/PageLayout.svelte";

  const { toggleShowMobileSidebar } = getContext();
  const { authorize } = authStore;
  let loginPage = $layout.path === "/login";

  if (!loginPage) {
    authorize().catch(() => $redirect(loginPage));
  }
</script>

<style lang="scss" global>
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
      font-size: 1.5rem;
    }
  }

  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .footer {
    border-top: 1px solid rgba(0, 0, 0, 0.125);
  }
</style>

<div class="main-layout">
  <!-- Navbar -->
  <Navbar expand="md" isDark>
    <div class="navbar-brand wmin-200"><a href={$url('/')} class="d-inline-block">LC | Accounting System</a></div>
    <div class="d-md-none">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar-mobile">
        <i class="icon-tree5" />
      </button>
      <button
        class="navbar-toggler sidebar-mobile-main-toggle"
        type="button"
        on:click|preventDefault={toggleShowMobileSidebar}>
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
        <SidebarContent />
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
<!-- close footer -->
