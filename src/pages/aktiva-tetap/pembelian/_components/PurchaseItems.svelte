<script>
  import Table from "__@comps/tables/DataTable.svelte";
  import { getFormContext } from "__@stores/form";
  import PurchaseItemForm from "./PurchaseItemForm.svelte";
  import { createItemContext } from "../../_item-context";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { generateId } from "@deboxsoft/module-client";
  import { convertToNumber } from "__@root/utils";

  export let diff = NaN;
  export let totalPayment = 0;
  const { fields, isValid, fieldsErrors, validateField } = getFormContext();
  const { items, total, addItem, validateItems } = createItemContext({
    validate,
    getAmountItem(item) {
      return (item.priceItem || 0) * (item.quantity || 0);
    },
    initialItem: $fields["items"],
    addItem: () => {
      return {
        index: generateId({ prefix: "item", size: 3 }),
        quantity: 1
      };
    }
  });
  const totalStore = total();
  validateItems();
  $: {
    diff = totalPayment - $totalStore;
    validate();
  }

  function validate(_ = $items) {
    validateField("items")(_);
    if ($totalStore === 0 || $totalStore !== totalPayment) {
      $fieldsErrors = { ...$fieldsErrors, noBalance: "total harga barang dan total pembayaran tidak sama" };
    } else {
      delete $fieldsErrors.noBalance;
      delete $fieldsErrors["total"];
      if (Object.keys($fieldsErrors).length === 0) {
        $isValid = true;
      }
    }
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <Table>
      <tr slot="header">
        <th class="text-left">Daftar Aset</th>
        <th class="text-center" width="150" />
        <th class="text-center" width="120" />
        <th class="text-left" width="270" />
        <th width="40">
          <a href="#" class="list-icons-item" on:click|stopPropagation={addItem}>
            <i class="icon-plus22" />
          </a>
        </th>
      </tr>
      {#each $items as item, index (item.index)}
        <PurchaseItemForm {index} {item} />
      {/each}
    </Table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1" />
    {#if totalPayment > 0 || $totalStore > 0}
      {#if diff === 0 && totalPayment > 0}
        <div class="text-success" style="width: 30px;">
          <CheckIcon />
        </div>
      {:else}
        <div class="text-danger" style="width: 30px;">
          <CloseIcon />
        </div>
      {/if}
    {/if}
    <div class="d-flex flex-column" style="width: 300px">
      <div class="d-flex">
        <span class="flex-grow-1">Total Harga Aset: Rp.</span>
        <span>{$totalStore ? convertToNumber({ value: parseFloat($totalStore) }) : "-"}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1 color-red"> Selisih: Rp.</span>
        <span>{diff ? convertToNumber({ value: diff * -1 }) : "-"}</span>
      </div>
    </div>
  </div>
</div>
