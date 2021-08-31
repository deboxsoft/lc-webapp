<!--routify:options title="Barang Masuk"-->
<script>
  import { StockOutInputSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import StockForm from "../_components/StockForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../_acl-context";
  import { getAuthenticationContext } from "../../../modules/users";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { out: outStock, stockStore, getStock } = stores.getStockTransferContext();
  const { getUserId } = getAuthenticationContext();
  const { loading, notify } = getApplicationContext();

  $: backUrl = $params.backUrl || "../";
  $: stock = $stockStore && getStock($params.id);

  async function onSubmit({ id, name, ...values }) {
    await outStock(stock.id, values, {});
    notify(`Barang keluar berhasil diupdate`, "success");
  }
</script>

{#if stock}
  <StockForm
    schema={StockOutInputSchema}
    stock={{ quantity: stock.quantity, userId: getUserId(), name: stock.name }}
    transform="OUT"
    {onSubmit}
    title="Form Barang Keluar"
    {backUrl}
  />
{/if}
