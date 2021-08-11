<!--routify:options title="Pengaturan"-->
<script>
  import { url, isActive } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { getAuthenticationContext, createUserContext, createAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";

  /**
   *
   * @type {ApplicationContext}
   */
  const { loading, apiUrl, fetchGraphql } = getApplicationContext();
  const { find, findGroup } = createUserContext({ apiUrl, fetchGraphql });
  const authContext = getAuthenticationContext();
  const { load, grants } = createAccessControlContext({ authContext, apiUrl, fetchGraphql });

  const boot = () => {
    $loading = true;
    const userPromise = find();
    const groupPromise = findGroup();
    const aclPromise = load();
    return Promise.all([groupPromise, userPromise, aclPromise]).then((_) => {
      $loading = false;
    });
  };
  boot();

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "pengaturan" });

  let show = true;

  function togglerCollapseHandler() {
    show = !show;
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="navbar-second">
    {#if $loading}
      <Loader />
    {:else}
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <a href={$url("./")} class="navbar-nav-link" class:active={$isActive("./index")}>
            <i class="icon-profile mr-2" />
            Profil
          </a>
        </li>
        {#if authContext.getQuery().read("setting").granted}
          <li class="nav-item">
            <a href={$url("./application")} class="navbar-nav-link" class:active={$isActive("./application")}>
              <i class="icon-wrench3 mr-2" />
              Aplikasi
            </a>
          </li>
        {/if}
        {#if authContext.getQuery().read("user").granted}
          <li class="nav-item">
            <a href={$url("./users")} class="navbar-nav-link" class:active={$isActive("./users")}>
              <i class="icon-user mr-2" />
              User
            </a>
          </li>
          <li class="nav-item">
            <a href={$url("./group")} class="navbar-nav-link" class:active={$isActive("./group")}>
              <i class="icon-users4 mr-2" />
              User Group
            </a>
          </li>
          <li class="nav-item">
            <a href={$url("./role")} class="navbar-nav-link" class:active={$isActive("./role")}>
              <i class="icon-user-lock mr-2" />
              Role
            </a>
          </li>
        {/if}
      </ul>
      <ul class="navbar-nav ml-xl-auto">
        {#if $isActive("./index")}
          <li class="nav-item">
            <a href={$url("./change-password")} class="navbar-nav-link">
              <i class="icon-key" />
              Change Password
            </a>
          </li>
        {/if}
        {#if $isActive("./role")}
          <li class="nav-item">
            <a href={$url("./role/create")} class="navbar-nav-link">
              <i class="icon-plus2" />
              Tambah Role
            </a>
          </li>
        {/if}
        {#if $isActive("./group")}
          <li class="nav-item">
            <a href={$url("./group/create")} class="navbar-nav-link">
              <i class="icon-plus2" />
              Tambah User Group
            </a>
          </li>
        {/if}
        {#if $isActive("./users")}
          <li class="nav-item">
            <a href={$url("./users/create")} class="navbar-nav-link">
              <i class="icon-user-plus" />
              Tambah User
            </a>
          </li>
        {/if}
      </ul>
    {/if}
  </svelte:fragment>
  <slot />
</PageLayout>
