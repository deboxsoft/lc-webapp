<script>
  import { goto } from "@roxi/routify";
  import { createAclContext } from "./_acl-context";

  const { readGranted } = createAclContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
</script>

<slot />
