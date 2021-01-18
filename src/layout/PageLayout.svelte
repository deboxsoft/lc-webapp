<script lang="ts">
  import { layout, url, page } from "@roxi/routify";
  import Breadcrumb from "@deboxsoft/svelte-theme-limitless/navigation/Breadcrumb.svelte";
  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import ArrowForwardIcon from "@deboxsoft/svelte-icons/ArrowForwardOutlined.svelte";
  import { getContext } from "__@root/stores/ui";

  const { toggleShowMobileSidebar } = getContext();
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
    <div class="page-header-content header-elements-inline">
      <h4>
        <!--          <Icon component={ArrowForwardIcon} />-->
        <span class="font-weight-semibold">{$layout.title} {($layout.title && $page.title && '-') || ''}</span>
        {($layout.title !== $page.title && `  ${$page.title}`) || ''}
      </h4>
      <slot name="header-elements" />
    </div>
    <Breadcrumb itemList={[{ title: 'home', path: $url('/') }]} />
  </div>

  <div class="content py-0">
    <slot />
  </div>
</div>
<!--  close page content-->
