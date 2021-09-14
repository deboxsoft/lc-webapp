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
  schema?: ZodObject<ZodRawShape>;
  fields?: Writable<Record<string, any>>;
  fieldsErrors?: Writable<Record<string, any>>;
  submittedEnable?: boolean;
  values?: any;
  isValid?: Writable<boolean>;
  validateField?: (args?: any) => (value?: unknown) => void;
}

const key = Symbol("form");
const createFieldsErrorStore = (isValid: Writable<boolean>) => {
  const { set, subscribe, update } = writable({});
  return {
    subscribe,
    set: (v) => {
      // set valid or invalid
      if (Object.keys(v).length === 0) {
        isValid.set(true);
      } else {
        isValid.set(false);
      }
      set(v);
    },
    update: (cb) => {
      update((v) => {
        const _errors = cb(v);
        if (Object.keys(v).length === 0) {
          isValid.set(true);
        } else {
          isValid.set(false);
        }
        return _errors;
      });
    }
  };
};
export const createFormContext = ({
  schema,
  values = {},
  validateField,
  fields = writable<Record<string, any>>(values),
  isValid = writable<boolean>(false),
  fieldsErrors = createFieldsErrorStore(isValid),
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
    return (value?: unknown) => {
      if (value) {
        $fields[fieldName] = value;
      }
      if (schema) {
        const _fieldSchema = schema.shape[fieldName];
        if (_fieldSchema) {
          const parsed = _fieldSchema.safeParse($fields[fieldName]);
          // @ts-ignore
          const { error } = parsed;
          fieldsErrors.update(($fieldsErrors) => {
            if (error) {
              const _errors = error.errors;
              if (Array.isArray(_errors)) {
                $fieldsErrors[fieldName] = _errors.map((_, i) => ({
                  path: _.path,
                  message: _.message
                }));
              } else {
                $fieldsErrors[fieldName] = error.errors[0].message;
              }
            } else if ($fieldsErrors[fieldName]) {
              delete $fieldsErrors[fieldName];
            }
            return $fieldsErrors;
          });
        }
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
