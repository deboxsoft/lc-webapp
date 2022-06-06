<script>
  import { getFormContext } from "__@stores/form";
  import PaymentItemForm from "./PaymentItemForm.svelte";
  import { createSubItemsContext } from "__@stores/subItemsContext";
  import { generateId } from "@deboxsoft/module-client";
  import { convertToNumber } from "__@root/utils";

  export let keyField = "paymentAccounts";
  export let totalPayment = 0;
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const { total, items, addItem, validateItems, isModified } = createSubItemsContext({
    validate,
    getAmountItem(_) {
      return _?.amount || 0;
    },
    initialItem: $fields[keyField],
    addItem() {
      return {
        index: generateId({ prefix: "item", size: 3 })
      };
    }
  });

  validateItems();
  $: {
    validate($items);
    $fields[keyField] = $items;
  }

  function validate(_ = $items) {
    validateField(keyField)(_);
  }

  $: {
    totalPayment = $total;
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th>Pembayaran</th>
          <th class="text-center" width="275" />
          <th class="text-center" width="40">
            <a href="#" class="list-icons-item" on:click|stopPropagation={addItem}>
              <i class="icon-plus22" />
            </a>
          </th>
        </tr>
      </thead>
      <tbody>
        {#each $items as item, index (item.index)}
          <PaymentItemForm {index} {item} />
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1" />
    <div class="d-flex flex-column" style="width: 300px">
      <div class="d-flex">
        <span class="flex-grow-1">Total Pembayaran: Rp.</span>
        <span>{totalPayment ? convertToNumber({ value: parseFloat(totalPayment) }) : "-"}</span>
      </div>
      <slot name="footer-right" {totalPayment} />
    </div>
  </div>
</div>
