<script>
  import RoleItemView from "./_role-item-view.svelte";

  export let resource;
  export let label = resource;
  export let actions;
  export let checked;
  export let indeterminate;
  export let readOnly = false;

  let objectResource;


  function checkboxHandler() {
    if (indeterminate) {
      checked = true;
      indeterminate = false;
    } else {
      checked = !checked;
    }
    const _tmp = actions && actions.map(({ selected, ..._ }) => ({ ..._, selected: checked })) || [];
    actions = [..._tmp];
  }

  function createActionCheckHandler(index) {
    return () => {
      actions[index].selected = !actions[index].selected
      let _selected = actions[index].selected;
      for (const action of actions) {
        checked = action.selected;
        if (_selected !== action.selected) {
          indeterminate = true;
          return;
        }
      }
      indeterminate = false;
      checked = _selected;
    }
  }
</script>

<RoleItemView {readOnly} expanded {label} bind:checked bind:indeterminate on:change={checkboxHandler}>
  {#if Array.isArray(actions)}
    <ol class="role-view">
      {#each actions as action, index}
        <RoleItemView {readOnly} value={action.value} checked={action.selected} label={action.label} on:change={createActionCheckHandler(index)} />
      {/each}
    </ol>
  {/if}
</RoleItemView>

<style lang="scss">
  .role-view {
    padding-left: 24px;
    margin: 0;
    list-style-type: none;
  }
</style>
