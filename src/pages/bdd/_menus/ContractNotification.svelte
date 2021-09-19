<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { getApplicationContext } from "../../../modules/app";
  import { createAclContext } from "./_acl-context";
  import { writable } from "svelte/store";
  import { getAuthenticationContext } from "../../../modules/users";

  const applicationContext = getApplicationContext();
  const { countWarningContract } = stores.createBddContext(applicationContext);
  const {getAccessControl} = getAuthenticationContext();
  const aclContext = createAclContext();
  export let count = writable(0);

  let readGranted;

  countWarningContract().then((_) => {
    $count = _;
    const acl = getAccessControl();
    readGranted = aclContext().readGranted;
  });
</script>

{#if readGranted}
    <a href="/bdd/warning" {...$$restProps}>
      <i class="icon-clipboard6" style="font-size: 1.25rem" />
        Kontrak BDD
      {#if $count > 0}
        <span class="badge badge-warning badge-pill ml-auto">{$count}</span>
      {/if}
    </a>
{/if}
