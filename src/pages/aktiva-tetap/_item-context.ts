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
  total(): Readable<number>;
}

const KEY = {};
export const createItemContext = <T extends { index: string } = any>(opts: Options<T>): _itemContext<T> => {
  if (hasContext(KEY)) {
    return getItemContext();
  }
  let itemsStore: Writable<T[]> = writable([]);
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
    },
    removeItem(index) {
      itemsStore.update((_) => {
        if (index > -1) {
          _.splice(index, 1);
        }
        return _;
      });
      validateItems();
    },
    total() {
      return derived(itemsStore, (items) => {
        return items.reduce((result, item) => {
          return result + parseFloat(opts.getAmountItem(item));
        }, 0);
      });
    }
  };
  setContext(KEY, context);
  return context;
};

export const getItemContext = <T extends { index: string } = any>() => getContext<_itemContext<T>>(KEY);
