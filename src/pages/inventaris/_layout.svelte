<!--routify:options title="Inventaris"-->

<script>
  import { url, goto, isActive } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "__@comps/loader/Loader.svelte";

  const { readGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { findCategory } = stores.createInventoryContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }

  $loading = true;
  findCategory().then(() => {
    $loading = false;
  });
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "inventaris" });
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="navbar-second">
    {#if $loading}
      <Loader />
    {:else}
      <ul class="nav navbar-nav">
        <li class="nav-item">
          <a href={$url("./home")} class="navbar-nav-link" class:active={$isActive("./home")}>
            <i class="icon-list2 mr-2" />
            Daftar Inventaris
          </a>
        </li>
        <li class="nav-item">
          <a href={$url("./category")} class="navbar-nav-link" class:active={$isActive("./category")}>
            <i class="icon-grid4 mr-2" />
            Kategori
          </a>
        </li>
      </ul>
      <ul class="navbar-nav ml-xl-auto">
        {#if $isActive("./home")}
          <li class="nav-item">
            <a href={$url("./home/create")} class="navbar-nav-link">
              <i class="icon-plus2" />
              Tambah Inventaris
            </a>
          </li>
        {/if}
        {#if $isActive("./category")}
          <li class="nav-item">
            <a href={$url("./category/create")} class="navbar-nav-link">
              <i class="icon-plus2" />
              Tambah Kategori
            </a>
          </li>
        {/if}
      </ul>
    {/if}
  </svelte:fragment>
  <slot />
</PageLayout>
