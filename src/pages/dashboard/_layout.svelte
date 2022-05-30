<!--routify:options title="Home"-->
<script>
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import { getAuthenticationContext } from "__@modules/users";
  import { createAclContext } from "__@root/utils/acl-utils";
  import { goto } from "@roxi/routify";

  const auth = getAuthenticationContext();
  const { readGranted } = createAclContext({
    resource: "dashboard",
    authContext: auth
  });
  if (!readGranted) {
    $goto("/home");
  }

  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext([
    {
      title: "Dashboard",
      path: "/dashboard"
    }
  ]);
</script>

<slot />
