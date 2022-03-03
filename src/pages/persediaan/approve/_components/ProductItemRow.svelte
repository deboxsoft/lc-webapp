<script>
  import CellNumber from "__@comps/CellNumber.svelte";

  /**
   * @type{import("@deboxsoft/accounting-api").Product}
   */
  export let product;
  export let productItem;

  function getTotal(item) {
    return item.quantity * item.price;
  }
</script>

<tr>
  <td>{product.name || "-"}</td>
  <td><CellNumber format="number" value={productItem.quantity} /></td>
  <td>{product.unit}</td>
  <td><CellNumber value={productItem.price} /></td>
  <td><CellNumber value={getTotal(productItem)} /></td>
</tr>