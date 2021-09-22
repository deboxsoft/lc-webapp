<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getSupplier } = stores.getSupplierContext();
  const { getAccount } = stores.getAccountContext();
  export let supplier;
  let dropdownContext;
</script>

<tr>
  <td>{supplier.name || ""}</td>
  <td>{supplier.address || ""}</td>
  <td>{supplier.phone || ""}</td>
  <td>{supplier.email || ""}</td>
  <td style="cursor: pointer; padding: 0">
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
        <a href={$url("./:id/view", { id: supplier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Detail</a
        >
        <a href={$url("./:id/update", { id: supplier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Edit</a
        >
        <a href={$url("./:id/remove", { id: supplier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Hapus</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
