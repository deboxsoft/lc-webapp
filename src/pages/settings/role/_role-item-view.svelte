<script>
  import InlineCheckBox from "../../../components/InlineCheckBox.svelte";
  import {createEventDispatcher} from "svelte"

  const dispatch = createEventDispatcher();

  export let expanded = false;
  export let label = "";
  export let hasChildren = false;
  export let value = undefined;
  export let checked = false;
  export let indeterminate = false;
  export let readOnly = false;

  function expandHandler() {
    expanded = !expanded;
  }

</script>

<li class="role-item" class:-expanded={expanded} class:-has-children={hasChildren || $$slots["default"]} class:-leaf={!hasChildren && !$$slots["default"]}>
  <span class="role-item-content">
    {#if hasChildren || $$slots["default"]}
      <button aria-label="Toggle" title="Toggle" type="button" class="button-toggle" on:click={expandHandler}>
        <i class:icon-chevron-down={expanded} class:icon-chevron-right={!expanded} />
      </button>
    {/if}
    <label>
      <InlineCheckBox disabled={readOnly} bind:checked bind:indeterminate labelStyle="padding: 0 5px" on:change />
      <i class:icon-file-empty={!hasChildren  && !$$slots["default"]} class:icon-folder={hasChildren || $$slots["default"]} class:icon-folder-open={expanded} />
      <span class="title">{label}</span>
    </label>
  </span>
  {#if (expanded)}
    <slot />
  {/if}
</li>

<style>
  .role-item.-leaf {
    padding-left: 28px;
  }

  .button-toggle {
    color: inherit;
    line-height: normal;
    cursor: pointer;
    border: none;
    background: none;
    outline: none;
  }
  .role-item-content {
    display: flex;
    align-items: center;
  }
  .role-item-content > label {
    margin-bottom: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .title {
    padding: 0 5px;
  }
</style>
