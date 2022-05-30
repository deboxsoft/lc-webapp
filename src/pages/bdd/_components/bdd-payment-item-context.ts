import { getContext, hasContext, setContext } from "svelte";
import { derived, get, Readable, writable, Writable } from "svelte/store";

type Options<T> = {
  validate: (val: T[]) => void;
  initialItem: T[];
  getAmountItem: (item: T) => any;
  addItem: () => T;
};

interface _itemContext<T> {
  items: Writable<T[]>;
  validateItems(): void;
  addItem(): void;
  updateItem(input: T): void;
  removeItem(index: number): void;
  total: Readable<number>;
  isModified: Readable<boolean>;
}

const KEY = {};
export const createBddPaymentContext = <T extends { index: string } = any>(opts: Options<T>): _itemContext<T> => {
  if (hasContext(KEY)) {
    return getItemContext();
  }
  let itemsStore: Writable<T[]> = writable([]);
  let modified = writable(false);
  if (!opts.initialItem) {
    itemsStore.set([opts.addItem()]);
  } else {
    itemsStore.set(opts.initialItem.map((_) => ({ ...opts.addItem(), ..._ })));
  }
  const validateItems = () => {
    opts.validate(get(itemsStore));
  };
  validateItems();
  const context: _itemContext<any> = {
    items: itemsStore,
    validateItems,
    addItem() {
      const defaultValue = opts.addItem();
      itemsStore.update((_) => [..._, defaultValue]);
      validateItems();
      modified.set(true);
    },
    updateItem(input) {
      itemsStore.update((_) => {
        const i = _.findIndex((__) => __.index === input.index);
        if (i > -1) {
          _[i] = { ..._[i], ...input };
        }
        return _;
      });
      validateItems();
      modified.set(true);
    },
    removeItem(index) {
      itemsStore.update((_) => {
        if (index > -1) {
          _.splice(index, 1);
        }
        return _;
      });
      validateItems();
      modified.set(true);
    },
    total: derived(itemsStore, (items) => {
      return items.reduce((result, item) => {
        return result + parseFloat(opts.getAmountItem(item));
      }, 0);
    }),
    isModified: modified
  };
  setContext(KEY, context);
  return context;
};

export const getItemContext = <T extends { index: string } = any>() => getContext<_itemContext<T>>(KEY);
