<!--routify:options title="Posting Data"-->
<script>
  import { StockInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import StockForm from "./_components/StockForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "../../modules/users";

  const { notify } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { create } = stores.getStockTransferContext();
  const { getCurrentDate } = stores.getPreferenceAccountingContext();

  let stock;
  (async () => {
    const now = await getCurrentDate();
    stock = {
      quantity: 1,
      userId: getUserId()
    };
  })();

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data persediaan ${values.name}`, "success");
  }
</script>

{#if stock}
  <StockForm schema={StockInputSchema} {stock} title="Membuat Data Persediaan" {onSubmit} />
{/if}
