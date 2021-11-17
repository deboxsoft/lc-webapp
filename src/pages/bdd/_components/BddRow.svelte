<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";

  export let bdd;
  let dropdownContext;
  $: total = bdd.taxRate > 0 ? bdd.amount + (bdd.taxRate * bdd.amount) / 100 : bdd.amount;
</script>

<tr>
  <td style="text-align: center">
    <a href={$url("./:id/view", { id: bdd.id })}>
      {bdd.id}
    </a>
  </td>
  <td style="text-align: center"><CellDate date={bdd.dateStart} /></td>
  <td style="text-align: center"><CellDate date={bdd.dateEnd} /></td>
  <td>{bdd.description || ""}</td>
  <td style="text-align: center"><TransactionStatus status={bdd.status} /></td>
  <td>{bdd.category || ""}</td>
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
          ><i class="icon-clipboard3" />Rekap depreciation</a
        >
        <a href={$url("./:id/view", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />Lihat BDD</a
        >
        {#if bdd.status !== "APPROVED"}
          <a href={$url("./:id/update", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-trash-alt" />Ubah BDD</a
          >
          <a href={$url("./:id/remove", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-pencil" />Hapus BDD</a
          >
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
