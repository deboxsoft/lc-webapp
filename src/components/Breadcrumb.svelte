<script>
  import { capitalCase } from "@deboxsoft/module-core";
  // props
  export let itemList = [];

  // state
  let { class: className = "" } = $$props;

  // handler
</script>

<div class="breadcrumb-line breadcrumb-line-light header-elements-lg-inline">
  <div class="d-flex">
    <div {...$$restProps} class="breadcrumb {className}">
      <div class="breadcrumb-item"><i class="icon-home2 mr-2" /></div>
      {#each itemList as breadcrumbItem, i}
        {#if i < itemList.length - 1}
          <a href={breadcrumbItem.path} class="breadcrumb-item">{capitalCase(breadcrumbItem.title)}</a>
        {:else}<span class="breadcrumb-item active">{capitalCase(breadcrumbItem.title)}</span>{/if}
      {/each}
    </div>
  </div>
  <div class="header-elements">
    <div class="breadcrumb justify-content-center">
      <slot />
    </div>
  </div>
</div>
