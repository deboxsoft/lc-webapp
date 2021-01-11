<script lang="ts" context="module">
  type Item = {
    label: string;
    value: any;
    checked?: boolean;
  };

  export type CheckList = Item[];
</script>

<script lang="ts">
  import { clsx, getId } from "@deboxsoft/svelte-theme-limitless/utils";

  export let id: string = getId({ prefix: "form-check" });
  export let type: "radio" | "checkbox" = "checkbox";
  export let name: string;
  export let value: any;
  export let checkList: CheckList = [];

  let { class: className } = $$props;
  let classes: string | undefined;

  $: classes = clsx(className, "form-check-input-styled");
</script>

{#each checkList as item}
  <div class="form-check">
    <label class="form-check-label" for={id}>
      <div class="uniform-choice">
        <span class:checked={item.value === value}>
          {#if type === 'radio'}
            <input {id} type="radio" class={classes} {name} bind:group={value} value={item.value} />
          {:else}<input type="checkbox" class={classes} {name} bind:group={value} value={item.value} />{/if}
        </span>
      </div>
      {item.label}
    </label>
  </div>
{/each}
