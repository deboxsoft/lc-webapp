<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  export let stock;
  let dropdownContext;
</script>

<tr>
  <td>{stock.name || ""}</td>
  <td>{stock.quantity}</td>
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
          ><i class="icon-eye" />Lihat Persediaan</a
        >
        <a href={$url("./:id/in", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-enter" />Barang Masuk</a
        >
        <a href={$url("./:id/out", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-exit" />Barang Keluar</a
        >
        <a href={$url("./:id/remove", { id: stock.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash" />Hapus Persediaan</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
