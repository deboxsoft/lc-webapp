<!--routify:options title="Posting Data"-->
<script>
  import { StockInputSchema } from "@deboxsoft/accounting-api";
  import { stores } from "@deboxsoft/accounting-client";
  import FormStock from "./_components/FormStock.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "../../modules/users";

  const { notify, loading } = getApplicationContext();
  const { getUserId } = getAuthenticationContext();
  const { create } = stores.getStockTransferContext();

  let stock = {
    quantity: 1,
    userId: getUserId()
  };

  async function onSubmit(values) {
    await create(values);
    notify(`Berhasil membuat data persediaan ${values.name}`, "success");
  }
</script>

<FormStock schema={StockInputSchema} {stock} title="Membuat Data Persediaan" {onSubmit} />
