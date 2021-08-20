<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import AccountCell from "../../../components/account/CellAccount.svelte";

  export let categoryInventory;
  let dropdownContext;
</script>
amortisasi
<tr>
  <td>{categoryInventory.name || ""}</td>
  <td>{categoryInventory.estimatedLife || ""}</td>
  <td>
    <AccountCell id={categoryInventory.assetAccount} />
  </td><td>
    <AccountCell id={categoryInventory.accumulatedDepreciationAccount} />
  </td>
  <td>
    <AccountCell id={categoryInventory.depreciationAccount} />
  </td>
  <td style="cursor: pointer; padding: 0">
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
        <a href={$url("./:id/view", { id: categoryInventory.id })} class="dropdown-item"
          ><i class="icon-eye" />Detail Kategori Inventaris</a
        >
        <a href={$url("./:id/update", { id: categoryInventory.id })} class="dropdown-item"
          ><i class="icon-trash-alt" />Update Kategori Inventaris</a
        >
        <a href={$url("./:id/remove", { id: categoryInventory.id })} class="dropdown-item"
          ><i class="icon-pencil" />Hapus Kategori Inventaris</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
