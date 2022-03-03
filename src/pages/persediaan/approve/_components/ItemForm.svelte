<svelte:options immutable={true} />

<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { generateId } from "@deboxsoft/module-client";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import { createFormContext } from "__@stores/form";
  import { debounce } from "@deboxsoft/module-core";
  import { getItemContext } from "../../_item-context";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import { writable } from "svelte/store";

  const itemContext = getItemContext();
  const { categoryStockStore, productContext } = stores.getStockContext();
  const { productStore } = productContext;

  export let id = generateId({ prefix: "item", size: 3 });
  export let stockProduct;
  export let index;
  export let mutation;

  let productSelect;

  const productId = stockProduct?.productId;
  if (productId) {
    productSelect = {
      productId,
      name: stockProduct.name
    };
  }

  let product = writable(undefined),
    quantityAutoNumeric,
    maxQuantity,
    minQuantity = 1,
    setPriceValue;

  const { fields } = createFormContext({ values: stockProduct });

  function searchProduct() {
    if (!$productStore) {
      productContext.load().then(() => $productStore);
    }
    return Promise.resolve().then(() => $productStore);
  }

  function changeProductHandler() {
    return () => {
      if ($product) {
        $fields.productId = $product.id;
        $fields.name = $product.name;
        if (mutation === "STOCK_IN") {
          setPriceValue && setPriceValue($product.price);
          maxQuantity = 10000000000000;
        } else {
          if (!$product.available || $product.available === 0) {
            $fields.quantity = 0;
            maxQuantity = 0;
            minQuantity = 0;
          } else {
            $fields.quantity = $product.available;
            maxQuantity = $product.available;
          }
        }
        $fields.price = $product.price;
      } else {
        maxQuantity = 10000000000000;
      }
      updateHandler();
    };
  }

  function changeQuantityHandler() {
    return debounce((e) => {
      updateHandler();
    });
  }

  function changePriceHandler() {
    return debounce((e) => {
      updateHandler();
    });
  }

  function updateHandler() {
    itemContext.updateItem($fields);
  }

  function removeHandler() {
    itemContext.removeItem(index);
  }
</script>

<tr>
  <td>
    <AutoCompleteField
      id="product-{id}"
      name="productId"
      placeholder="Nama Barang"
      inputClassName="form-control"
      delay="20"
      labelFieldName="name"
      searchFunction={searchProduct}
      valueFunction={(item) => {
        $product = item;
        return item?.productId;
      }}
      selectedItem={productSelect}
      showClear
      on:change={changeProductHandler()}
    />
  </td>
  <td>
    <InputNumberField
      id="quantity-{id}"
      name="quantity"
      format="number"
      emptyInputBehavior="min"
      pristineValue="1"
      minimumValue={minQuantity}
      maximumValue={maxQuantity}
      bind:autoNumeric={quantityAutoNumeric}
      on:input={changeQuantityHandler()}
    />
  </td>
  <td>
    {#if mutation === "STOCK_IN"}
      <InputNumberField id="price-{id}" name="price" on:input={changePriceHandler()} bind:setValue={setPriceValue} />
    {:else}
      <CellNumber value={$fields.price} />
    {/if}
  </td>
  <td style="padding: unset">
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={index < 1}
      disabled={index < 1}
    >
      <TrashIcon />
    </button>
  </td>
</tr>
