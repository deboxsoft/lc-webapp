<script>
  import { isActive, url } from "@roxi/routify";
  import Icon from "__@root/layout/Icon.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAclContext } from "./_acl-context";
  import { writable } from "svelte/store";

  const applicationContext = getApplicationContext();
  const { countWarningContractStore } = stores.createBddContext(applicationContext);
  const aclContext = getAclContext();
  let readGranted;
  export let subItem;

  let count = writable(0);
  $: {
    if (isFinite($countWarningContractStore)) {
      readGranted = aclContext().readGranted;
    }
  }
</script>

<a {...$$restProps} class:active={$isActive(subItem.url)} href={$url(subItem.url)}>
  {#if subItem.icon && typeof subItem.icon === "string"}
    <i class={subItem.icon} />
  {:else if subItem.icon}
    <Icon component={subItem.icon} />
  {/if}
  <span>{subItem.label}</span>
  {#if readGranted && $countWarningContractStore > 0}
    <span class="badge badge-warning badge-pill ml-auto">{$countWarningContractStore}</span>
  {/if}
</a>
