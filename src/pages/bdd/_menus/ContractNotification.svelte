<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "./_acl-context";
  import { writable } from "svelte/store";
  import { getAuthenticationContext } from "__@modules/users";

  const applicationContext = getApplicationContext();
  const { countWarningContractStore, countWarningContract } = stores.createBddContext(applicationContext);
  const { getAccessControl } = getAuthenticationContext();
  const aclContext = getAclContext();
  export let count = writable(0);
  countWarningContract();

  let readGranted;

  $: {
    if (isFinite($countWarningContractStore)) {
      const acl = getAccessControl();
      readGranted = aclContext().readGranted;
    }
    $count = $countWarningContractStore || 0;
  }
</script>

{#if readGranted}
  <a href="/bdd/warning" {...$$restProps} on:mouseup>
    <i class="icon-clipboard6" style="font-size: 1.25rem" />
    Kontrak BDD
    {#if $countWarningContractStore > 0}
      <span class="badge badge-warning badge-pill ml-auto">{$countWarningContractStore}</span>
    {/if}
  </a>
{/if}
