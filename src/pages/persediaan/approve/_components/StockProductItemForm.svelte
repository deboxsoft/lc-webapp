<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { generateId } from "@deboxsoft/module-client";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import AutoCompleteField from "__@comps/forms/AutoCompleteField.svelte";
  import { createFormContext } from "__@stores/form";
  import { debounce } from "@deboxsoft/module-core";
  import CellNumber from "__@comps/CellNumber.svelte";

  const { productContext } = stores.getStockContext();
  const { productStore } = productContext;

  export let id = generateId({ prefix: "stock-product", size: 3 });
  export let stockProduct;
  export let index;
  export let mutation;
  export let fieldName = "products";
  export let onRemoveStockProduct = () => {};
  export let onUpdateStockProduct = () => {};

  let product, setPriceValue, price;
  const { fields } = createFormContext({ values: stockProduct });


  function searchProduct() {
    if (!$productStore) {
      productContext.load().then(() => $productStore);
    }
    return Promise.resolve().then(() => $productStore);
  }

  function changeProductHandler() {
    return () => {
      if (product) {
        $fields.productId = product.id;
        if (stockProduct.mutation === "STOCK_IN") {
          setPriceValue(product.price);
        } else {
          price = product.price;
        }
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
      placeholder="Barang"
      inputClassName="form-control"
      delay="20"
      labelFieldName="name"
      searchFunction={searchProduct}
      valueFunction={(item) =>{
        product = item;
        return item?.productId;
      }}
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
      on:input={changeQuantityHandler()}
    />
  </td>
  <td>
    {#if mutation === "STOCK_IN"}
      <InputNumberField id="price-{id}" name="price" on:input={changePriceHandler()} bind:setValue={setPriceValue} />
    {:else}
      <CellNumber value={price} />
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
