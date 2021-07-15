<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellRp from "__@comps/CellRp.svelte";
  import dayjs from "dayjs";
  import { get } from "svelte/store";
  let dropdownContext;
</script>

<tr>
  <td>{stock.name || ""}</td>
  <td>{dayjs(purchaseDate).format()}</td>
  <td>{get(getCategoryInventory(stock.categoryId))?.name || ""}</td>
  <td>
    <CellRp value={stock.priceItem} />
  </td>
  <td>{stock.quantity}</td>
  <td>
    <CellRp value={stock.priceItem * stock.quantity} />
  </td>
  <td style="cursor: pointer;padding: 0">
    <Dropdown
      class="h-100 d-flex justify-content-center"
      bind:context={dropdownContext}
      menuProps={{
        offset: [0, -15]
      }}
    >
      <DropdownToggle class="list-icons-item align-items-center" tag="div">
        <i class="icon-menu9" />
      </DropdownToggle>
      <svelte:fragment slot="menu">
        <a href={$url("./:id/view", { id: stock.id })} class="dropdown-item"
          ><i class="icon-eye" />Lihat Persediaan</a
        >
        <a href={$url("./:id/update", { id: stock.id })} class="dropdown-item"
          ><i class="icon-trash-alt" />Ubah Persediaan</a
        >
        <a href={$url("./:id/remove", { id: stock.id })} class="dropdown-item"
          ><i class="icon-pencil" />Hapus Persediaan</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
