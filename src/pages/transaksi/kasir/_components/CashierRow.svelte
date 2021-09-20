<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import { createProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";

  const applicationContext = getApplicationContext();
  const { getProgram, programStore, find } = createProgramContext(applicationContext);

  export let cashier;
  let dropdownContext;

</script>

<tr>
  <td>{cashier.name || ""}</td>
  <td>{dayjs(cashier.date).format("DD-MM-YY")}</td>
  <td>
    <CellNumber value={cashier.amount} />
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
