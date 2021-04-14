<script lang="ts">
  import type { ZodObject, ZodRawShape } from "@deboxsoft/zod";
  import type { Writable } from "svelte/store";

  import { createEventDispatcher, tick, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { ZodError } from "@deboxsoft/zod";
  import { createFormContext } from "__@stores/form";
  import { getApplicationContext } from "__@modules/app";

  const dispatch = createEventDispatcher();
  const { notify } = getApplicationContext();

  export let schema: ZodObject<ZodRawShape> | undefined = undefined;
  export let values: Record<string, any> = {};
  export let ignoreAttribs: string | string[] = "id";
  export let validateField: any = undefined;
  export let submittedEnable: boolean = false;
  export let checkValidateFirst: boolean = false;
  export let isValid: Writable<boolean> = writable(false);

  const { submitted: _submitted, fieldsErrors: _fieldsErrors, fields: _fields } = createFormContext({
    schema,
    values,
    validateField,
    submittedEnable,
    isValid
  });

  export let fieldsErrors = _fieldsErrors;
  export let submitted = _submitted;
  export let fields = writable({});

  $: fields = _fields;

  onMount(async () => {
    await tick()
    if (checkValidateFirst) {
      try {
        const _values = validate()
      } catch (e) {}
    }
  })

  function submitHandler() {
    try {
      $submitted = true;
      const _values = validate();
      dispatch("submit", _values);
    }catch (e) {
      if (e instanceof ZodError) {
        notify(`${e.errors[0].path[0]}: ${e.errors[0].message}`, "error");
      }
    }
  }

  function validate() {
    try {
      return schema
        .transform((input) => {
          if (ignoreAttribs) {
            if (Array.isArray(ignoreAttribs)) {
              ignoreAttribs.forEach((_key) => {
                if (input[key]) delete input[key];
              });
            } else if (typeof ignoreAttribs === "string") {
              if (input[ignoreAttribs]) {
                delete input[ignoreAttribs];
              }
            }
          }
          return input;
        })
        .parse($fields);
    } catch (e) {
      if (e instanceof ZodError) {
        $fieldsErrors = e.flatten().fieldErrors;
      }
      throw e;
    }
  }
</script>

<form on:submit|preventDefault={submitHandler} {...$$restProps}>
  <slot />
</form>
