<script>
  import { tick } from "svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import Form from "__@comps/forms/Form.svelte";
  import { filteringAccountCash, filteringAccountExpense, filteringAccountStock } from "__@root/utils";
  import StockProductForm from "./StockProductForm.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { writable } from "svelte/store";

  const { notify, loading } = getApplicationContext();
  const { stockStore, productContext } = stores.getStockContext();
  const { getAccountLeaf } = stores.getAccountContext();

  // props
  export let stock;
  export let onSubmit;
  export let schema;
  /** @type {"STOCK_IN" | "STOCK_OUT"} */
  export let mutation = undefined;
  export let fields;
  export let fieldsErrors;
  export let isValid;

  let buttonSaveDisable, stockProducts = writable(undefined), isStartup = true;

  $: {
    if ($fields && isStartup) {
      stockProducts = writable(($fields.products || []).map((_) => ({ ..._, ...createStockProduct() })));
      tick().then(() => {
        isStartup = false;
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
      case "expense": {
        return filteringAccountExpense(accountStore);
      }
    }
  }
</script>

<Form checkValidateFirst {schema} values={stock} bind:fields bind:fieldsErrors bind:isValid>
  <div class="card">
    <div class="card-body">
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="date">Tanggal</label>
          <InputDateField id="date" name="date" class="form-control" placeholder="Tanggal" range={false} disabled />
        </div>
        {#if mutation === "STOCK_IN"}
          <div class="form-group col-12 col-md-6">
            <label for="creditAccount">Akun Pembayaran</label>
            <AccountSelect
              id="cashAccount"
              name="cashAccount"
              placeholder="Akun Pembayaran"
              allowEmpty
              accountStore={getAccount("cash")}
            />
          </div>
        {:else}
          <div class="form-group col-12 col-md-6">
            <label for="expenseAccount">Akun Biaya Persediaan</label>
            <AccountSelect
              id="expenseAccount"
              name="expenseAccount"
              placeholder="Akun Biaya Persediaan"
              allowEmpty
              accountStore={getAccount("expense")}
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
  {#if !isStartup}
    <StockProductForm bind:stockProducts {mutation} />
  {/if}
</Form>
