<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../../components/DropdownToggle.svelte";
  import CellRp from "../../../../components/CellRp.svelte";
  import dayjs from "dayjs";

  export let cashier;
  let dropdownContext;

</script>

<tr>
  <td>{cashier.name || ""}</td>
  <td>{dayjs(cashier.date).format("DD-MM-YY")}</td>
  <td>
    <CellRp value={cashier.amount} />
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
        <a href={$url("./:id/view", { id: cashier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Lihat Data</a
        >
        <a href={$url("./:id/update", { id: cashier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Edit</a
        >
        <a href={$url("./:id/remove", { id: cashier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Hapus</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
