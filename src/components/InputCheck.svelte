<script lang="ts" context="module">
  type Item = {
    id?: string;
    label: string;
    value: any;
    checked?: boolean;
  };

  export type CheckList = Item[];
</script>

<script>
  import { clsx, generateId } from "@deboxsoft/module-client";

  export let type = "checkbox";
  export let name;
  export let defaultValue = undefined;
  export let value = defaultValue;
  export let checkList = [];

  let { class: className } = $$props;
  let classes;

  $: classes = clsx(className, "form-check-input-styled");
</script>

{#each checkList as {value: _value, label: _label, id = generateId({prefix: "form-check"})}}
  <div class="form-check">
    <label class="form-check-label" for={id}>
      <div class="uniform-choice">
        <span class:checked={_value === value}>
          {#if type === "radio"}
            <input {id} type="radio" class={classes} {name} bind:group={value} value={_value} />
          {:else}<input type="checkbox" class={classes} {name} bind:group={value} value={_value} />{/if}
        </span>
      </div>
      {_label}
    </label>
  </div>
{/each}
