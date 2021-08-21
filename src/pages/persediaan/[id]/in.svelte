<!--routify:options title="Barang Masuk"-->
<script>
  import { StockInInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import FormStock from "../_components/FormStock.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import { getAuthenticationContext } from "../../../modules/users";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { in: inStock, stockStore, getStock } = stores.getStockTransferContext();
  const { getUserId } = getAuthenticationContext();
  const { loading, notify } = getApplicationContext();

  $: to = $params.to || "../";
  $: stock = $stockStore && getStock($params.id);

  async function onSubmit({ id, name, ...values }) {
    await inStock(stock.id, values, {});
    notify(`Barang masuk berhasil ditambahkan`, "success");
  }
</script>

{#if stock}
  <FormStock
    schema={StockInInputSchema}
    stock={{ price: stock.price, quantity: 1, userId: getUserId(), name: stock.name }}
    transform="IN"
    {onSubmit}
    title="Form Barang Masuk"
    {to}
  />
{/if}
