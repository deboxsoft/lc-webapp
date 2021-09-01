<!--routify:options title="Aktiva Tetap"-->
<script>
  import { Container } from "@deboxsoft/module-core";
  import { url, goto, isActive } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";
  import Loader from "../../components/loader/Loader.svelte";
  import Dropdown from "../../components/Dropdown.svelte";
  import DropdownToggle from "../../components/DropdownToggle.svelte";
  import { createReportContext } from "./_export";

  const context = {
    sync: undefined
  };
  Container.set("inventory", context);
  const { readGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const reportContext = createReportContext();
  const { loading } = applicationContext;
  const { findCategory, findPage, find } = stores.createInventoryContext(applicationContext);
  if (!readGranted) {
    $goto("/access-denied");
  }
  $loading = true;
  let loaded = false;
  const inventoryPromise = findPage({ filter: {}, pageCursor: {} }, {});
  const categoryPromise = findCategory();
  Promise.all([inventoryPromise, categoryPromise]).then(() => {
    $loading = false;
    loaded = true;
  });
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "aktiva-tetap" });

  function sync() {
    context.sync();
  }

  function createExportMenuHandler(close) {
    return {
      pdf: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      },
      csv: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      },
      print: () => {
        find().then((_) => {
          reportContext.pdf(_);
          close();
        });
      }
    };
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="navbar-second">
    <ul class="nav navbar-nav">
      <li class="nav-item">
        <a href={$url("./home")} class="navbar-nav-link" class:active={$isActive("./home")}>
          <i class="icon-list2 mr-2" />
          Daftar Aktiva Tetap
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
            Tambah Aktiva Tetap
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
          Refresh
        </a>
      </li>
      {#if $isActive("./home")}
        <li class="nav-item">
          <Dropdown class="breadcrumb-elements-item dropdown p-0">
            <DropdownToggle class="navbar-nav-link" caret nav>
              <i class="icon-file-download2 mr-1" />
              Ekspor
            </DropdownToggle>
            <svelte:fragment slot="menu" let:closeHandler={dropdownClose}>
              <a
                href="/#"
                target="_self"
                on:click|preventDefault={createExportMenuHandler(dropdownClose).pdf}
                class="dropdown-item"
              >
                <i class="icon-file-pdf" />
                Download PDF</a
              >
              <a
                href="/#"
                target="_self"
                on:click|preventDefault={createExportMenuHandler(dropdownClose).csv}
                class="dropdown-item"
              >
                <i class="icon-file-excel" />
                Download CSV</a
              >
              <a
                href="/#"
                target="_self"
                on:click|preventDefault={createExportMenuHandler(dropdownClose).print}
                class="dropdown-item"
              >
                <i class="icon-printer2" />
                Print</a
              >
            </svelte:fragment>
          </Dropdown>
        </li>
      {/if}
    </ul>
  </svelte:fragment>
  {#if !loaded}
    <Loader />
  {:else}
    <slot />
  {/if}
</PageLayout>
