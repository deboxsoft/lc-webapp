<script lang="ts">
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getFormContext } from "__@stores/form";
  import DatePickr from "__@comps/DatePickr.svelte";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let name;
  export let disabled: boolean = false;
  export let formattedValue: string = "";
  export let options = {};
  export let mode: "month-select" | undefined = undefined;
  export let input: any = undefined;
  const { class: className } = $$props;

  let classes = "";
  let invalid = true;
  let msgError;

  $: classes = clsx(className);

  $: {
    if ($fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }
</script>

<DatePickr {...$$restProps} {disabled} class={className} bind:value={$fields[name]}>
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</DatePickr>
