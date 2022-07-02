<script>
  import { generateId } from "@deboxsoft/module-client";

  export let id = generateId();
  export let label = "";
  export let idFilter = generateId();
  export let filterHidden = false;
  export let disabled = false;
  export let showLabel = false;
  export let filterPlaceholder = undefined;
  export let filterValue = undefined;
  export let options = [];
  export let onFilterChange = () => {};
  export let onSelected = () => {};
  export let ref;

  function filterChangeHandler() {
    onFilterChange();
  }

  function selectedHandler(e) {
    onSelected();
  }
</script>

<div class="list-box">
  {#if showLabel}
    <label class="control-label" for={id}>{label}</label>
  {/if}
  {#if !filterHidden}
    <div class="filter-container">
      <label for={idFilter} class="control-label sr-only">Filter</label>
      <input
        type="text"
        class="form-control"
        on:change={filterChangeHandler}
        placeholder={filterPlaceholder}
        value={filterValue}
        {disabled}
      />
    </div>
  {/if}
  <div class="control-container">
    <select
      {id}
      bind:this={ref}
      multiple
      class="control-select form-control"
      on:change={selectedHandler}
      on:dblclick
      on:keyup
      {disabled}
    >
      {#each options as option, index}
        {#if option.options}
          <optgroup label={option.label}>
            {#each option.options as _option, _index}
              <option
                value={_option.value}
                title={_option.label}
                data-value={JSON.stringify(_option.value)}
                data-index={_index}
              >
                {_option.label}
              </option>
            {/each}
          </optgroup>
        {:else}
          <option
            value={option.value}
            title={option.title}
            data-value={JSON.stringify(option.value)}
            data-index={index}
          >
            {option.label}
          </option>
        {/if}
      {/each}
    </select>
  </div>
</div>

<style lang="scss">
  .list-box {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    align-self: stretch;

    .control-label {
    }
    .filter-container {
      margin-bottom: 10px;
    }

    .control-container {
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      .control-select {
        flex: 1 0 auto;
      }
    }
    optgroup {
      font-weight: bold;
    }
    option {
      padding: 0.125rem 0.5rem;
    }
  }
</style>
