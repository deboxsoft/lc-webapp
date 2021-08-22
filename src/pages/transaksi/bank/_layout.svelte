<!--routify:options title="Manajemen Bank"-->
<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { url, goto } from "@roxi/routify";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import Loader from "../../../components/loader/Loader.svelte"
  import { createAclContext } from "./_acl-context";
  import { getApplicationContext } from "__@modules/app";

  const { readGranted } = createAclContext();
  const applicationContext = getApplicationContext();
  const { find } = stores.createBankContext(applicationContext);

  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "Manajemen Bank" });

  let submitting = true;
  find().then((result) => {
    submitting = false;
  });
</script>

{#if submitting}
  <Loader />
{:else}
  <slot />
{/if}
