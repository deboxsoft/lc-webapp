import type { Product } from "@deboxsoft/accounting-api";
import { getContext, hasContext, setContext } from "svelte";
import { derived, get, Readable, writable, Writable } from "svelte/store";
import { stores } from "@deboxsoft/accounting-client";

type ProductItem = {
  index: string;
  productId?: Product["id"];
  name?: Product["name"];
  quantity?: number;
  price?: Product["price"];
};

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
export const createItemContext = (opts: Options<ProductItem>): _itemContext<ProductItem> => {
  if (hasContext(KEY)) {
    return getItemContext();
  }
  const productContext = stores.getProductContext();
  let itemsStore: Writable<ProductItem[]> = writable([]);
  if (!opts.initialItem) {
    itemsStore.set([opts.addItem()]);
  } else {
    const _items = opts.initialItem;
    const ids = _items.map((_) => _.productId);
    productContext.findByIds(ids).then((_products) => {
      const mappingItems = _items.map((_item) => {
        const i = _products.findIndex((_) => _.id === _item.productId);
        const product: Partial<Product> = _products[i] || {};
        return { ...opts.addItem(), ..._item, productId: product.id, name: product.name };
      });
      itemsStore.set(mappingItems);
    });
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

export const getItemContext = <T = ProductItem>() => getContext<_itemContext<T>>(KEY);
