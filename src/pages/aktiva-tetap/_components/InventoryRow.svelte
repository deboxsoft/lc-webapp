<script>
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import dayjs from "dayjs";

  const { getCategoryInventory } = stores.getInventoryContext();
  export let inventory;
  let dropdownContext;

  $: getCategoryInventory(inventory.categoryId);
</script>

<tr>
  <td>{inventory.name || ""}</td>
  <td>{dayjs(inventory.date).format("DD-MM-YY")}</td>
  <td>{getCategoryInventory(inventory.categoryId)?.name || ""}</td>
  <td>{inventory.quantity}</td>
  <td>
    <CellNumber value={inventory.priceItem} />
  </td>
  <td>
    <CellNumber value={inventory.priceItem * inventory.quantity} />
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
        <a href={$url("./:id/depreciation", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-clipboard3" />Rekap Depresiasi</a
        >
        <a href={$url("./:id/view", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Lihat Aktiva Tetap</a
        >
        <a href={$url("./:id/update", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Edit Aktiva Tetap</a
        >
        <a href={$url("./:id/remove", { id: inventory.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Hapus Aktiva Tetap</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
