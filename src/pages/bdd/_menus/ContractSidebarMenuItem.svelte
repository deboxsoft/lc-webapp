<script>
  import { isActive, url } from "@roxi/routify";
  import Icon from "../../../layout/Icon.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";
  import { createAclContext } from "./_acl-context";
  import { writable } from "svelte/store";

  const applicationContext = getApplicationContext();
  const { countWarningContract } = stores.createBddContext(applicationContext);
  const aclContext = createAclContext();
  let readGranted;
  export let subItem;

  let count = writable(0);
  countWarningContract().then((_) => {
    $count = _;
    readGranted = aclContext().readGranted;
  });

</script>

<a {...$$restProps} class:active={$isActive(subItem.url)} href={$url(subItem.url)}>
  {#if subItem.icon && typeof subItem.icon === "string"}
    <i class={subItem.icon} />
  {:else if subItem.icon}
    <Icon component={subItem.icon} />
  {/if}
  <span>{subItem.label}</span>
  {#if $count > 0}
    <span class="badge badge-warning badge-pill ml-auto">{$count}</span>
  {/if}
</a>
