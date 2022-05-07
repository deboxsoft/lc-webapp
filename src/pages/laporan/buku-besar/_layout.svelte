<!--routify:options title="Laporan"-->
<script>
  import { goto } from "@roxi/routify";
  import { createAclContext } from "../_acl-context";

  const { readGranted } = createAclContext("ledger");
  if (!readGranted) {
    $goto("/access-denied");
  }
</script>

<slot />
