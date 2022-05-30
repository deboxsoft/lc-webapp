<!--routify:options title="Beranda"-->
<script>
  import { goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/users-client";
  import { createAclContext } from "__@root/utils/acl-utils";

  const authContext = stores.getAuthenticationContext();
  const { readGranted } = createAclContext({
    authContext,
    resource: "dashboard"
  });
  if (readGranted) {
    $goto("/dashboard");
  }
</script>

<slot />
