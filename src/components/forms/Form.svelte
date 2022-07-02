<script>
  import { createEventDispatcher, onMount, tick } from "svelte";
  import { writable } from "svelte/store";
  import { ZodError } from "@deboxsoft/zod";
  import { createFormContext } from "__@stores/form";
  import { getApplicationContext } from "__@modules/app";

  const dispatch = createEventDispatcher();
  const { notify } = getApplicationContext();

  export let schema = undefined;
  export let values = {};
  export let ignoreAttribs = "id";
  export let validateField = undefined;
  export let transform = undefined;
  export let submittedEnable = false;
  export let checkValidateFirst = false;
  export let feedbackValidateDisable = checkValidateFirst;
  export let isValid = writable(false);

  const {
    submitted: _submitted,
    fieldsErrors: _fieldsErrors,
    fields: _fields
  } = createFormContext({
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
    await tick();
    if (checkValidateFirst) {
      try {
        const _values = validate();
      } catch (e) {}
    }
  });

  export let submitHandler = () => {
    try {
      !feedbackValidateDisable && ($submitted = true);
      const _values = validate();
      dispatch("submit", _values);
      return _values;
    } catch (e) {
      console.error(e);
      if (e instanceof ZodError) {
        throw e.errors[0];
      }
      throw e;
    }
  };

  function validate() {
    let _value = {};
    try {
      if (schema) {
        _value = schema
          .transform((input) => {
            if (typeof transform === "function") {
              return transform(input);
            }
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
        $isValid = true;
      } else if (transform) {
        _value = transform($fields);
        $isValid = true;
      }
      return _value;
    } catch (e) {
      if (e instanceof ZodError) {
        $fieldsErrors = e.flatten().fieldErrors;
      }
      throw e;
    }
  }
</script>

<form on:submit|preventDefault="{submitHandler}" {...$$restProps}>
  <slot />
</form>
