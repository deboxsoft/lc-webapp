<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  export let stock;
  let dropdownContext, supplier, category;
</script>

<tr>
  <td>{stock.name || ""}</td>
  <td>{supplier || ""}</td>
  <td>{category || ""}</td>
  <td style="text-align: center">{stock.quantity}</td>
  <td>
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
          ><i class="icon-clipboard3" />Kartu Stok</a
        >
        <a href={$url("./:id/update", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-pencil" />Edit Barang</a
        >
        <a href={$url("./:id/remove", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash" />Hapus Persediaan</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
