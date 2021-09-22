<script>
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import { getApplicationContext } from "__@modules/app";

  const applicationContext = getApplicationContext();
  const { productContext, supplierStore, categoryStore, categoryContext, supplierContext, getSupplier } =
    stores.getStockContext();
  export let product;
  let dropdownContext, supplier, category;
  const productStore = productContext.productStore;

  $: {
    if (!supplier && $supplierStore && $productStore) {
      supplier = productContext.getSupplier(product.id);
    }
  }

  $: {
    if (!category && $categoryStore && $productStore) {
      category = productContext.getCategory(product.id);
    }
  }
</script>

<tr>
  <td>{product.id}</td>
  <td>{product.name || ""}</td>
  <td>{category?.name || ""}</td>
  <td>{supplier?.name || ""}</td>
  <td>{product.unit || ""}</td>
  <td style="text-align: center">{product.available || ""}</td>
  <td>
    <CellNumber value={product.price} />
  </td>
  <td style="cursor: pointer;padding: 0">
    <Dropdown
      class="h-100 d-flex justify-content-center"
      bind:context={dropdownContext}
      menuProps={{
        offset: [0, -15]
      }}
    >
      <DropdownToggle class="list-icons-item d-flex align-items-center" tag="div">
        <i class="icon-menu9" />
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler>
        <a href={$url("./:id/view", { id: product.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-clipboard3" />Kartu Stok</a
        >
        <a href={$url("./:id/update", { id: product.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Edit Barang</a
        >
        <a href={$url("./:id/remove", { id: product.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash" />Hapus Persediaan</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
