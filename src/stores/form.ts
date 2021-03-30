import type { ZodObject, ZodRawShape } from "@deboxsoft/zod";
import type { Writable } from "svelte/store";

import { getContext, setContext } from "svelte";
import { writable } from "svelte/store";

export interface Context {
  schema: ZodObject<ZodRawShape>;
  fields: Writable<Record<string, any>>;
  submitted: Writable<boolean>;
  isValid: Writable<boolean>;
  fieldsErrors: Writable<Record<string, string[]>>;
  validateField: (args?: any) => (value?: unknown) => void;
}

export interface Options {
  schema: ZodObject<ZodRawShape>;
  fields?: Writable<Record<string, any>>;
  fieldsErrors: Writable<Record<string, string[]>>;
  submittedEnable?: boolean;
  values?: any;
  isValid: Writable<boolean>;
  validateField?: (args?: any) => (value?: unknown) => void;
}

const key = Symbol("form");

export const createFormContext = ({
  schema,
  values,
  validateField,
  fields = writable<Record<string, any>>(values),
  isValid = writable(false),
  fieldsErrors = writable({}),
  submittedEnable = false
}: Options) => {
  let submitted = writable(submittedEnable);
  let $fields = {};
  submitted.subscribe((_submitted) => {
    submittedEnable = _submitted;
  });
  fields.subscribe((_fields) => {
    $fields = _fields;
  });

  function validateFieldDefault(fieldName: string) {
    return (value: unknown) => {
      if (schema) {
        const parsed = schema.pick({ [fieldName]: true }).safeParse({ [fieldName]: $fields[fieldName] });
        // @ts-ignore
        const { success, error } = parsed;
        fieldsErrors.update(($fieldsErrors) => {
          if (error) {
            $fieldsErrors[fieldName] = error.errors[0].message;
          } else if ($fieldsErrors[fieldName]) {
            delete $fieldsErrors[fieldName];
          }
          return $fieldsErrors;
        });
      }
    };
  }

  const context: Context = {
    schema,
    fields,
    fieldsErrors,
    submitted,
    isValid,
    validateField: validateField || validateFieldDefault
  };

  setContext<Context>(key, context);
  return context;
};

export const getFormContext = (): Context => getContext(key);
