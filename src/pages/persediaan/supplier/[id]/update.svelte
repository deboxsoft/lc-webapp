<!--routify:options title="Edit Supplier"-->

<script>
  import { SupplierUpdateSchema } from "@deboxsoft/accounting-api";
  import { params, goto } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import CategoryInventoryForm from "../_components/SupplierForm.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted } = getAclContext();
  if (!updateGranted) {
    $goto("/access-denied");
  }
  const { update, getSupplier, supplierStore } = stores.getSupplierContext();
  const { notify } = getApplicationContext();

  let supplier, loaded = false;

  $: to = $params.to || "../";
  $: {
    if (!loaded && $supplierStore) {
      supplier = getSupplier($params.id);
      loaded = true;
    }
  }

  async function onSubmit({ id, ...values }) {
    await update(supplier.id, values);
    notify(`Berhasil mengedit data supplier`, "success");
  }
</script>

{#if supplier}
  <CategoryInventoryForm
    {supplier}
    schema={SupplierUpdateSchema}
    isUpdate
    {onSubmit}
    title="Update Supplier"
    {to}
  />
{/if}
