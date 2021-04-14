<script lang="ts">
  import type { BreadcrumbItem } from "__@stores/breadcrumb";

  import { layout, page } from "@roxi/routify";
  import Breadcrumb from "@deboxsoft/svelte-theme-limitless/navigation/Breadcrumb.svelte";
  import { getUIContext } from "__@stores/ui";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "__@comps/loader/Loader.svelte";
  import { getApplicationContext } from "__@modules/app";

  export let breadcrumb: BreadcrumbItem | BreadcrumbItem[] | undefined = undefined;

  const { loading } = getApplicationContext();
  const { toggleShowMobileSidebar } = getUIContext();
  const { setBreadcrumb, breadcrumbStore } = getBreadcrumbStore();
  if (breadcrumb) {
    setBreadcrumb(breadcrumb);
  }
</script>

  <div class="content-wrapper">
    {#if $loading}
      <Loader />
    {:else}
      <div class="page-header page-header-light">
        {#if $breadcrumbStore.length > 0}
          <Breadcrumb itemList={$breadcrumbStore} />
        {/if}
        <div class="mb-1 mt-1 page-header-content header-elements-inline">
          <h4>
            <span class="font-weight-semibold">{$layout.title} {($layout.title && $page.title && "-") || ""}</span>
            {($layout.title !== $page.title && `  ${$page.title}`) || ""}
          </h4>
          <slot name="header-elements" />
        </div>
        {#if $$slots["navbar-second"]}
          <div class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="text-center d-lg-none w-100">
              <button
                type="button"
                class="navbar-toggler dropdown-toggle"
                data-toggle="collapse"
                data-target="#navbar-second"
              >
                <i class="icon-unfold mr-2" />
                navigation
              </button>
            </div>
            <div class="navbar-collapse collapse" id="navbar-second">
              <slot name="navbar-second" />
            </div>
          </div>
        {/if}
      </div>
      <div class="content flex-grow-1 d-flex">
        <slot />
      </div>
    {/if}
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
