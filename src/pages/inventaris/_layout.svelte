<!--routify:options title="Inventaris"-->

<script>
  import { Container } from "@deboxsoft/module-core";
  import { url, goto, isActive } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "../../components/loader/Loader.svelte";

  const context = {
    sync: undefined
  };
  Container.set("inventory", context)
  const { readGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const { loading } = applicationContext;
  const { findCategory, findPage } = stores.createInventoryContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  $loading = true;
  let loaded = false;
  const inventoryPromise = findPage({filter: {}, pageCursor: {}}, {});
  const categoryPromise = findCategory();
  Promise.all([inventoryPromise, categoryPromise]).then(() => {
    $loading = false;
    loaded = true;
  });
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "inventaris" });
  function sync() {
    context.sync();
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="navbar-second">
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
      <li class="nav-item">
      <a href="#" target="_self" on:click={sync} class="navbar-nav-link">
        <i class="icon-sync mr-1" />
        Sinkronisasi
      </a>
      </li>
    </ul>
  </svelte:fragment>
  {#if !loaded}
    <Loader />
  {:else}
    <slot />
  {/if}
</PageLayout>
