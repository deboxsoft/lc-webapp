<script>
  import { getFormContext } from "__@stores/form";
  import DatePicker from "@deboxsoft/svelte-datepicker/src/components/DatePicker.svelte";
  import { CalendarStyle } from "@deboxsoft/svelte-datepicker/src/calendar-style";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let disabled = false;
  export let formattedValue = "";
  export let options = {};
  export let startDateKey = "startDate";
  export let endDateKey = "endDate";
  export let name = undefined;
  export let allowEmpty = false;
  export let className = $$props.class || "form-control";
  export let width = "100%";
  export let showClearButton = false;
  export let selected = $fields
    ? name
      ? $fields[name]
      : $fields[startDateKey]
      ? [$fields[startDateKey], $fields[endDateKey]]
      : undefined
    : undefined;
  export let range = !(selected instanceof Date);
  /**
   * @type {"month-select" | "menu" | undefined}
   */
  export let mode = undefined;
  export let input = undefined;

  let invalid = true;
  let msgError;

  function applyHandler({ detail }) {
    if ($fields) {
      if (name) {
        $fields[name] = [detail.from, detail.to];
      } else {
        $fields[startDateKey] = detail.from;
        $fields[endDateKey] = detail.to;
      }
    }
    dispatcher("apply", detail);
  }

  $: {
    if ($fieldsErrors && $fieldsErrors[name]) {
      invalid = true;
      msgError = $fieldsErrors[name];
    } else {
      invalid = false;
    }
  }
</script>

<DatePicker
  {...$$restProps}
  class={className}
  {range}
  {allowEmpty}
  placeholder="Tanggal"
  format="DD-MMM-YY"
  applyLabel="Pilih"
  closeLabel="Tutup"
  bind:selected
  styling={new CalendarStyle({ buttonWidth: "100%", datepickerWidth: width })}
  wrapperInputClass="form-group-feedback form-group-feedback-right"
  {showClearButton}
  on:range-selected={applyHandler}
  on:date-selected={applyHandler}
  end
>
  {#if $submitted}
    {#if invalid}
      <p class="invalid-tooltip">{msgError}</p>
    {/if}
  {/if}
</DatePicker>

<style global>
  .datepicker button {
    outline: none;
  }
</style>
