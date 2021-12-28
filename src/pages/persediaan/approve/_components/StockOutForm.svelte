<script>
  import { tick } from "svelte";

  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import Form from "__@comps/forms/Form.svelte";
  import { filteringAccountCash, filteringAccountStock } from "__@root/utils";
  import StockProductForm from "./StockProductForm.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { writable } from "svelte/store";

  const { notify, loading } = getApplicationContext();
  const { stockStore, productContext } = stores.getStockContext();
  const { getAccountLeaf } = stores.getAccountContext();

  // props
  export let onSubmit;
  export let stockTransaction;
  export let schema;
  /** @type {"STOCK_IN" | "STOCK_OUT"} */
  export let mutation = undefined;
  export let fields;
  export let fieldsErrors;
  export let isValid;

  let buttonSaveDisable, stockProducts = writable(undefined), ready = false;

  $: {
    if ($fields && !ready) {
      stockProducts = writable(($fields.products || []).map((_) => ({ ..._, ...createStockProduct() })));
      tick().then(() => {
        ready = true;
      })
    }
  }

  $: {
    tick().then(() => {
      buttonSaveDisable = !$isValid || $loading;
    });
  }

  function createStockProduct() {
    return { index: generateId({ prefix: "product-input", size: 3 }), quantity: 1 };
  }


  export function addProductStock() {
    $stockProducts = [...$stockProducts, createStockProduct()];
  }

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "stock": {
        return filteringAccountStock(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
    }
  }
</script>

<Form checkValidateFirst {schema} values={stockTransaction} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12">
          <label for="date">Tanggal</label>
          <InputDateField id="date" name="date" class="form-control" placeholder="Tanggal" range={false} disabled />
        </div>
      </div>
    </div>
  </div>
  {#if !!ready}
    <StockProductForm bind:stockProducts {mutation} />
  {/if}
</Form>
