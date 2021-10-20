<script>
  import { url } from "@roxi/routify";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";

  export let stock;
  let dropdownContext, supplier, category, stockIn, stockOut;

  if (stock.mutation === "STOCK_IN") {
    stockIn = stock.quantity;
  } else {
    stockOut = stock.quantity;
  }
</script>

<tr>
  <td align="center">
    <a href={$url("./:id/view", { id: stock.id })}>
      {stock.id}
    </a>
  </td>
  <td style="text-align: center"><CellDate date={stock.date} /></td>
  <td>{stock.name || ""}</td>
  <td align="center">{stock.unit || ""}</td>
  <td align="center"><CellNumber format="number" value={stockIn} /></td>
  <td align="center"><CellNumber format="number" value={stockOut} /></td>
  <td align="center"><CellNumber format="number" value={stock.available} /></td>
  <td align="center">
    <CellNumber value={stock.price} />
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
        <a href={$url("./:id/view", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-clipboard3" />detail</a
        >
        <!--          <a href={$url("./:id/update", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}-->
        <!--          ><i class="icon-pencil" />Edit Barang</a-->
        <!--          >-->
        <!--          <a href={$url("./:id/remove", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}-->
        <!--            ><i class="icon-trash" />Hapus Persediaan</a-->
        <!--          >-->
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
