<script lang="ts">
  import type { BreadcrumbItem } from "__@stores/breadcrumb";

  import { layout, page, goto } from "@roxi/routify";
  import Breadcrumb from "__@comps/Breadcrumb.svelte";
  import { getUIContext } from "__@stores/ui";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getApplicationContext } from "__@modules/app";

  export let breadcrumb: BreadcrumbItem | BreadcrumbItem[] | undefined = undefined;
  export let backHandler = () => {
    $goto("../");
  };
  export let showBackButton = false;
  export let breadcrumbDisable = false;
  export let headerPageDisable = false;

  const { loading } = getApplicationContext();
  const { toggleShowMobileSidebar } = getUIContext();
  const { setBreadcrumb, breadcrumbStore } = getBreadcrumbStore();
  let show = true;
  if (breadcrumb) {
    setBreadcrumb(breadcrumb);
  }
  function togglerCollapseHandler() {
    show = !show;
  }
</script>

<div class="content-wrapper">
  {#if !headerPageDisable}
    <div class="page-header page-header-light">
      <div class="mb-1 mt-1 page-header-content header-elements-inline">
        <h4>
          {#if showBackButton}
            <a href="/#" target="_self" on:click|preventDefault={backHandler}>
              <i class="icon-arrow-left52 mr-2" />
            </a>
          {/if}
          <span class="font-weight-semibold">{$layout.title} {($layout.title && $page.title && "-") || ""}</span>
          {($layout.title !== $page.title && `  ${$page.title}`) || ""}
        </h4>
        <slot name="header-elements" />
      </div>
      {#if $breadcrumbStore.length > 0 && !breadcrumbDisable}
        <Breadcrumb itemList={$breadcrumbStore}>
          <slot name="breadcrumb-items-right" />
        </Breadcrumb>
      {/if}
      {#if $$slots["navbar-second"]}
        <div class="navbar navbar-expand-lg navbar-light bg-light">
          <div class="text-center d-lg-none w-100">
            <button
              type="button"
              class="navbar-toggler dropdown-toggle"
              data-toggle="collapse"
              data-target="#navbar-second"
              on:click={togglerCollapseHandler}
            >
              <i class="icon-unfold mr-2" />
              navigation
            </button>
          </div>
          <div class="navbar-collapse collapse" id="navbar-second" class:show>
            <slot name="navbar-second" />
          </div>
        </div>
      {/if}
    </div>
  {/if}
  <div class="content">
    <slot />
  </div>
</div>

<!--  close page content-->
<style lang="scss" global>
  .navbar {
    .navbar-brand {
      > a {
        color: white;
      }
      font-size: inherit;
    }
  }

  .dbx-theme {
    .table td,
    .table th {
      padding: 0.5rem 0.75rem;
    }
    .content-wrapper {
      overflow: hidden;
    }
    .content {
      padding: 10px;
      //height: calc(100vh - 160px);
      //overflow: auto;
      flex-direction: column;
      display: flex;
    }
  }

  .content > .card {
    margin-bottom: 0;
  }

  .page-header-content {
    h4 {
      margin-top: 0;
      margin-bottom: 0;
    }
  }
</style>
