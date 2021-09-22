<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import { getFormContext } from "__@stores/form";
  import StockProductItemForm from "./StockProductItemForm.svelte";

  export let stockProducts;
  export let mutation;
  const { fields, isValid, fieldsErrors, validateField } = getFormContext();
  const stockProductsValidate = validateField("products");

  $: {
    if ($stockProducts) {
      validate();
    }
  }

  export function validate() {
    stockProductsValidate($stockProducts);
  }

  export function updateProductStockHandler(input) {
    const _stockProducts = $stockProducts;
    const i = _stockProducts.findIndex((_) => _.index === input.index);
    _stockProducts[i] = input;
    $stockProducts = _stockProducts;
  }

  function removeProductStockHandler(index) {
    const _stockProducts = $stockProducts;
    _stockProducts.splice(index, 1);
    $stockProducts = _stockProducts;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <Table>
      <tr slot="header">
        <th class="text-center">Barang</th>
        <th class="text-center" width="70">Jumlah</th>
        {#if mutation === "STOCK_IN"}
          <th class="text-center" width="270">Harga Satuan</th>
        {/if}
        <th width="40" />
      </tr>
      {#each $stockProducts as stockProduct, index (stockProduct.index)}
        <StockProductItemForm
          {mutation}
          {index}
          {stockProduct}
          onRemoveStockProduct={removeProductStockHandler}
          onUpdateStockProduct={updateProductStockHandler}
        />
      {/each}
    </Table>
  </div>
</div>
