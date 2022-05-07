<!--routify:options title="Home"-->
<script>
  import { getBreadcrumbStore } from "__@stores/breadcrumb";

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext([
    {
      title: "Dashboard",
      path: "/dashboard"
    }
  ]);
</script>

<slot />
