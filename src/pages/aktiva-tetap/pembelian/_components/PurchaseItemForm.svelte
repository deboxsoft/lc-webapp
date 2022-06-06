<script>
  import { stores } from "@deboxsoft/accounting-client";
  import { generateId } from "@deboxsoft/module-client";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import TrashIcon from "__@comps/icons/Trash.svelte";
  import { createFormContext } from "__@stores/form";
  import { debounce } from "@deboxsoft/module-core";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import { getItemContext } from "../../_item-context";

  const itemContext = getItemContext();
  const { categoryInventoryStore } = stores.getInventoryContext();
  export let id = generateId({ prefix: "item", size: 3 });
  export let item;
  export let index;
  let setPriceValue;

  const { fields } = createFormContext({ values: item });

  function changeItemHandler() {
    return debounce((e) => {
      updateHandler();
    });
  }

  function updateHandler() {
    itemContext.updateItem($fields);
  }

  function removeHandler() {
    itemContext.removeItem(index);
  }
</script>

<tr>
  <td>
    <InputField
      id="name-{id}"
      name="name"
      placeholder="Nama Aset *"
      type="text"
      class="form-control"
      on:input={changeItemHandler()}
    />
  </td>
  <td>
    <ComboxField
      id="categoryId"
      name="categoryId"
      class="form-control"
      items={$categoryInventoryStore}
      valueId="id"
      labelId="name"
      placeholder="Kategori *"
      on:change={changeItemHandler()}
    />
  </td>
  <td>
    <InputNumberField
      id="quantity-{id}"
      name="quantity"
      format="number"
      pristineValue="1"
      minimumValue="0"
      on:input={changeItemHandler()}
    />
  </td>
  <td>
    <InputNumberField id="price-{id}" name="priceItem" on:input={changeItemHandler()} placeholder="Harga Satuan *" />
  </td>
  <td style="padding: unset">
    <button
      type="button"
      on:click={removeHandler}
      class="btn btn-outline btn-icon alpha-danger text-danger"
      class:disabled={index < 1}
      disabled={index < 1}
    >
      <TrashIcon />
    </button>
  </td>
</tr>
