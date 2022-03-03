<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import { getFormContext } from "__@stores/form";
  import ItemForm from "./ItemForm.svelte";
  import { createItemContext } from "../../_item-context";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { convertToNumber } from "__@root/utils";
  import { stores } from "@deboxsoft/accounting-client";

  const { fields, isValid, fieldsErrors, validateField } = getFormContext();
  const { findByIds: findProducts } = stores.getProductContext();
  let productItems = [],
    ready = false;
  const { items, total, addItem, validateItems } = createItemContext({
    validate(_) {
      validate(_);
    },
    getAmountItem(item) {
      return (item.price || 0) * (item.quantity || 0);
    },
    initialItem: $fields["productItems"],
    addItem: () => {
      return {
        index: generateId({ prefix: "item", size: 3 }),
        quantity: 1
      };
    }
  });
  export let diff = NaN;
  const totalStore = total();
  validateItems();
  $: {
    diff = ($fields.cashAmount || 0) - $totalStore;
    validate();
    $isValid;
  }

  function validate(_ = $items) {
    validateField("productItems")(_);
    if ($fields.mutation === "STOCK_IN" && ($totalStore === 0 || $totalStore < $fields.cashAmount)) {
      $fieldsErrors = { ...$fieldsErrors, noBalance: "cash melebihi dari harga total" };
    } else {
      delete $fieldsErrors.noBalance;
      delete $fieldsErrors["total"];
    }
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <Table>
      <tr slot="header">
        <th class="text-left">Nama Barang</th>
        <th class="text-center" width="120">Jumlah</th>
        <th class="text-left" width="270">Harga Satuan</th>
        <th width="40" />
      </tr>
      {#each $items as item, index (item.index)}
        <ItemForm {index} stockProduct={item} mutation={$fields.mutation} />
      {/each}
    </Table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button type="button" class="btn btn-light" on:click={addItem}>
        <ListPlusIcon class="mr-2" />
        Tambah Item
      </button>
    </div>
    {#if $fields.mutation === "STOCK_IN" && ($fields.cashAmount > 0 || $totalStore > 0)}
      <!--negatif valid jika total lebih besar dari jumlah pembayaran sisanya masuk hutang-->
      {#if diff <= 0 && $fields.cashAmount > 0}
        <div class="text-success" style="width: 30px;">
          <CheckIcon />
        </div>
      {:else}
        <div class="text-danger" style="width: 30px;">
          <CloseIcon />
        </div>
      {/if}
    {/if}
    <div class="d-flex flex-column" style="width: 250px">
      <div class="d-flex">
        <span class="flex-grow-1">Total: Rp.</span>
        <span>{$totalStore ? convertToNumber({ value: parseFloat($totalStore) }) : "-"}</span>
      </div>
      {#if $fields.mutation === "STOCK_IN"}
        <div class="d-flex">
          <span class="flex-grow-1">Pembayaran Tunai: Rp.</span>
          <span>{$fields.cashAmount ? convertToNumber({ value: parseFloat($fields.cashAmount) }) : "-"}</span>
        </div>
        <div class="d-flex" style="border-top: solid 1px gray">
          <span class="flex-grow-1 color-red"> Hutang: Rp.</span>
          <span>{diff ? convertToNumber({ value: diff * -1 }) : "-"}</span>
        </div>
      {/if}
    </div>
  </div>
</div>
