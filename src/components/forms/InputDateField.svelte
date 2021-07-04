<script>
  import { clsx } from "@deboxsoft/svelte-theme-limitless/utils";
  import { getFormContext } from "__@stores/form";
  import DatePicker from "@deboxsoft/svelte-datepicker/src/components/DatePicker.svelte"
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let name;
  export let disabled = false;
  export let formattedValue = "";
  export let options = {};
  export let startDateKey = "startDate";
  export let endDateKey = "endDate"
  /**
   * @type {"month-select" | "menu" | undefined}
   */
  export let mode = undefined;
  export let input = undefined;
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

<!--<DatePickr {...$$restProps} {mode} {disabled} class={className} bind:value={$fields[name]} on:close>-->
<!--  {#if $submitted}-->
<!--    {#if invalid}-->
<!--      <p class="invalid-tooltip">{msgError}</p>-->
<!--    {/if}-->
<!--  {/if}-->
<!--</DatePickr>-->

<DatePicker class={className} range placeholder="Tanggal" applyLabel="Pilih" closeLabel="Tutup"  >
    {#if $submitted}
      {#if invalid}
        <p class="invalid-tooltip">{msgError}</p>
      {/if}
    {/if}
</DatePicker>
