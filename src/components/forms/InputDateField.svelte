<script>
  import dayjs from "dayjs";
  import { getFormContext } from "__@stores/form";
  import DatePicker from "@deboxsoft/svelte-datepicker/src/components/DatePicker.svelte";
  import { CalendarStyle } from "@deboxsoft/svelte-datepicker/src/calendar-style";
  import { createEventDispatcher } from "svelte";

  const { validateField, fields, fieldsErrors, submitted } = getFormContext() || {};
  const dispatcher = createEventDispatcher();

  export let disabled = false;
  export let format = "DD-MMMM-YYYY";
  export let options = {};
  export let selectFromDateKey = "from";
  export let selectToDateKey = "to";
  export let name = undefined;
  export let allowEmpty = false;
  export let className = $$props.class || "form-control";
  export let width = "100%";
  export let showClearButton = false;
  export let value = undefined;
  export let yearEditable = false;
  export let startDate = dayjs().subtract(20, "year");
  export let endDate = dayjs().add(20, "year");
  export let clearDate = undefined;
  if (value) {
    if ($fields && name) {
      $fields[name] = value;
    }
  }
  export let selected = $fields
    ? name
      ? $fields[name]
      : $fields[selectFromDateKey]
      ? [$fields[selectFromDateKey], $fields[selectToDateKey]]
      : undefined
    : undefined;
  export let range = !(selected instanceof Date);
  export let input = undefined;

  let invalid = !disabled;
  let msgError;
  function applyHandler({ detail }) {
    if ($fields) {
      if (range) {
        const _from = detail.from.toDate();
        const _to = detail.to.endOf("d").toDate();
        if (name) {
          $fields[name] = [_from, _to];
        } else {
          $fields[selectFromDateKey] = _from;
          $fields[selectToDateKey] = _to;
        }
      } else if (name) {
        $fields[name] = detail.date.toDate();
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

{#if !disabled}
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
    bind:clearHandler={clearDate}
    styling={new CalendarStyle({ buttonWidth: "100%", datepickerWidth: width })}
    wrapperInputClass="form-group-feedback form-group-feedback-right"
    {showClearButton}
    on:range-selected={applyHandler}
    on:date-selected={applyHandler}
    end
    {disabled}
    {yearEditable}
    {startDate}
    {endDate}
  >
    {#if $submitted}
      {#if invalid}
        <p class="invalid-tooltip">{msgError}</p>
      {/if}
    {/if}
  </DatePicker>
{:else}
  <input class="form-control" disabled value={dayjs().format(format)} />
{/if}

<style global>
  .datepicker button {
    outline: none;
  }
</style>
