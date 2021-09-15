<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../components/DropdownToggle.svelte";
  import CellNumber from "../../../components/CellNumber.svelte";
  import dayjs from "dayjs";

  export let bdd;
  let dropdownContext;
  const total = bdd.taxRate > 0 ? bdd.amount + (bdd.taxRate * bdd.amount / 100) : bdd.amount;
</script>

<tr>
  <td>{dayjs(bdd.date).format("DD-MM-YY") || ""}</td>
  <td>{dayjs(bdd.dateStart).format("DD-MM-YY") || ""}</td>
  <td>{dayjs(bdd.dateEnd).format("DD-MM-YY") || ""}</td>
  <td>{bdd.description || ""}</td>
  <td style="text-align: center">{bdd.taxRate || ""}</td>
  <td>
    <CellNumber value={bdd.amount} />
  </td>
  <td>
    <CellNumber value={total} />
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
        <a href={$url("./:id/amortization", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-clipboard3" />Rekap Amortisasi</a
        >
        <a href={$url("./:id/view", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Lihat Inventaris</a
        >
        <a href={$url("./:id/update", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Ubah Inventaris</a
        >
        <a href={$url("./:id/remove", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Hapus Inventaris</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
