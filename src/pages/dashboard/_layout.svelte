<!--routify:options title="Home"-->
<script>
  import { getBreadcrumbStore, BREADCRUMB_CONTEXT } from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext([]);

</script>
<slot />
