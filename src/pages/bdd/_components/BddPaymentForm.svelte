<script>
  import { getFormContext } from "__@stores/form";
  import ListPlusIcon from "__@comps/icons/ListPlus.svelte";
  import CheckIcon from "__@comps/icons/Check.svelte";
  import CloseIcon from "__@comps/icons/Close.svelte";
  import { convertToNumber } from "__@root/utils";
  import BddPaymentItemForm from "./BddPaymentItemForm.svelte";
  import { createBddPaymentContext } from "./bdd-payment-item-context";
  import { generateId } from "@deboxsoft/module-client";

  export let createCreditAccount;
  const { fields, fieldsErrors, isValid, validateField } = getFormContext();
  const { total, items, addItem, validateItems, isModified } = createBddPaymentContext({
    validate,
    getAmountItem(_) {
      return _?.amount || 0;
    },
    initialItem: $fields["creditAccounts"],
    addItem() {
      return {
        index: generateId({ prefix: "item", size: 3 })
      };
    }
  });

  validateItems();

  $: {
    validate($items);
  }

  $: taxValue = $items && $fields?.taxRate ? (parseFloat($fields.taxRate) * parseFloat($total)) / 100 : 0;

  function validate(_ = $items) {
    validateField("creditAccounts")(_);
  }
</script>

<div class="card flex-grow-1">
  <div class="card-body">
    <table class="table">
      <thead>
        <tr>
          <th>Akun Kredit</th>
          <th class="text-center" width="275">Nominal</th>
          <th class="text-center" width="40" />
        </tr>
      </thead>
      <tbody>
        {#each $items as item, index (item.index)}
          <BddPaymentItemForm {index} {item} />
        {/each}
      </tbody>
    </table>
  </div>
  <div class="card-footer d-flex">
    <div class="flex-grow-1">
      <button type="button" class="btn btn-light" on:click={addItem}>
        <ListPlusIcon class="mr-2" />
        Tambah Akun Kredit
      </button>
    </div>
    {#if $isModified}
      {#if $total > 0}
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
        <span class="flex-grow-1">Jumlah: Rp.</span>
        <span>{$total ? convertToNumber({ value: parseFloat($total) }) : "-"}</span>
      </div>
      <div class="d-flex">
        <span class="flex-grow-1">Pajak: Rp.</span>
        <span>{$fields?.taxRate ? convertToNumber({ value: taxValue }) : "-"}</span>
      </div>
      <div class="d-flex" style="border-top: solid 1px gray">
        <span class="flex-grow-1 color-red"> Total: Rp.</span>
        <span>{$total ? convertToNumber({ value: $total + taxValue }) : "-"}</span>
      </div>
    </div>
  </div>
</div>
