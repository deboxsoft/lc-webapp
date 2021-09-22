<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { generateId } from "@deboxsoft/module-client";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";
  import { createFormContext } from "__@stores/form";
  import { debounce } from "@deboxsoft/module-core";

  const { productContext } = stores.getStockContext();
  const { productStore } = productContext;

  export let id = generateId({ prefix: "stock-product", size: 3 });
  export let stockProduct;
  export let updateProduct;
  export let index;
  export let mutation;
  export let fieldName = "products";
  export let onRemoveStockProduct = () => {};
  export let onUpdateStockProduct = () => {};

  const { fields } = createFormContext({ values: stockProduct });


  function searchProduct() {
    if (!$productStore) {
      productContext.load().then(() => $productStore);
    }
    return Promise.resolve().then(() => $productStore);
  }

  function changeProductHandler() {
    return () => {
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
    onUpdateStockProduct($fields);
  }

  function removeHandler() {
    onRemoveStockProduct(index);
  }
</script>

<tr>
  <td>
    <AutoCompleteField
      id="product-{id}"
      name="productId"
      placeyholder="Barang"
      inputClassName="form-control"
      delay="20"
      valueFieldName="id"
      labelFieldName="name"
      searchFunction={searchProduct}
      maxItemsToShowInList="10"
      showClear
      on:change={changeProductHandler()}
    />
  </td>
  <td>
    <InputNumberField
      id="quantity-{id}"
      name="quantity"
      format="number"
      pristineValue="1"
      minimumValue="1"
      on:click={changeQuantityHandler()}
    />
  </td>
  {#if mutation === "STOCK_IN"}
    <td>
      <InputNumberField id="price-{id}" name="price" on:input={changePriceHandler()} />
    </td>
  {/if}
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
