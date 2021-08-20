<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import CellRp from "../../../components/CellRp.svelte";
  import dayjs from "dayjs";
  import { get } from "svelte/store";
  let dropdownContext;
</script>

<tr>
  <td>{inventory.name || ""}</td>
  <td>{dayjs(purchaseDate).format()}</td>
  <td>{get(getCategoryInventory(inventory.categoryId))?.name || ""}</td>
  <td>
    <CellRp value={inventory.priceItem} />
  </td>
  <td>{inventory.quantity}</td>
  <td>
    <CellRp value={inventory.priceItem * inventory.quantity} />
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
        <a href={$url("./:id/view", { id: inventory.id })} class="dropdown-item"
          ><i class="icon-eye" />Lihat Inventaris</a
        >
        <a href={$url("./:id/update", { id: inventory.id })} class="dropdown-item"
          ><i class="icon-trash-alt" />Ubah Inventaris</a
        >
        <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item"
          ><i class="icon-pencil" />Hapus Inventaris</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
