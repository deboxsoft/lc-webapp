<script lang="ts">
  import type { BreadcrumbItem } from "__@stores/breadcrumb";

  import { layout, url, page } from "@roxi/routify";
  import Breadcrumb from "@deboxsoft/svelte-theme-limitless/navigation/Breadcrumb.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import ArrowForwardIcon from "@deboxsoft/svelte-icons/ArrowForwardOutlined.svelte";
  import { getContext } from "__@stores/ui";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";

  export let breadcrumb: BreadcrumbItem | BreadcrumbItem[] | undefined = undefined;

  const { toggleShowMobileSidebar } = getContext();
  const { setBreadcrumb, breadcrumbStore } = getBreadcrumbStore();
  if (breadcrumb) {
    setBreadcrumb(breadcrumb);
  }
</script>

<style lang="scss" global>
  .navbar {
    .navbar-brand {
      > a {
        color: white;
      }
      font-size: inherit;
    }
  }
</style>

<div class="content-wrapper">
  <div class="page-header .page-header-light">
    <div class="mb-1 mt-2 page-header-content header-elements-inline">
      <h4>
        <!--          <Icon component={ArrowForwardIcon} />-->
        <span class="font-weight-semibold">{$layout.title} {($layout.title && $page.title && '-') || ''}</span>
        {($layout.title !== $page.title && `  ${$page.title}`) || ''}
      </h4>
      <slot name="header-elements" />
    </div>
    {#if $breadcrumbStore.length > 0}
      <Breadcrumb itemList={$breadcrumbStore} />
    {/if}
  </div>

  <div class="content py-0">
    <slot />
  </div>
</div>
<!--  close page content-->
