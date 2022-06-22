<!--routify:options title="Laporan"-->
<script>
  import { goto } from "@roxi/routify";
  import { createAclContext } from "__@root/utils";

  const { readGranted } = createAclContext({ resource: "ledger" });
  if (!readGranted) {
    $goto("/access-denied");
  }
</script>

<slot />
