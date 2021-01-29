<script lang="ts" context="module">
  type Item = {
    id?: string;
    label: string;
    value: any;
    checked?: boolean;
  };

  export type CheckList = Item[];
</script>

<script lang="ts">
  import { clsx, getId } from "@deboxsoft/svelte-theme-limitless/utils";

  export let type: "radio" | "checkbox" = "checkbox";
  export let name: string;
  export let defaultValue: any = undefined;
  export let value: any = defaultValue;
  export let checkList: CheckList = [];

  let { class: className } = $$props;
  let classes: string | undefined;

  $: classes = clsx(className, "form-check-input-styled");
</script>

{#each checkList as {value: _value, label: _label, id = getId({prefix: "form-check"})}}
  <div class="form-check">
    <label class="form-check-label" for={id}>
      <div class="uniform-choice">
        <span class:checked={_value === value}>
          {#if type === 'radio'}
            <input {id} type="radio" class={classes} {name} bind:group={value} value={_value} />
          {:else}<input type="checkbox" class={classes} {name} bind:group={value} value={_value} />{/if}
        </span>
      </div>
      {_label}
    </label>
  </div>
{/each}
