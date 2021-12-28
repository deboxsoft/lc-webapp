<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import { getAclContext } from "../../_acl-context";

  const { removeGranted, updateGranted } = getAclContext();

  /**
   * @type{import("@deboxsoft/accounting-api").InventoryTransaction}
   */
  export let inventoryTransaction;
  let dropdownContext;

  function getTotal(items) {
    return items.reduce((result, item) => {
      return result + item.priceItem * item.quantity;
    }, 0);
  }

</script>

<tr class="cursor-pointer">
  <td on:click>{inventoryTransaction.no || ""}</td>
  <td class="text-center" on:click><CellDate date={inventoryTransaction.date} /></td>
  <td on:click>{inventoryTransaction.description || ""}</td>
  <td on:click><CellNumber value={getTotal(inventoryTransaction.items)} /></td>
  <td on:click><TransactionStatus status={inventoryTransaction.status} /> </td><td style="cursor: pointer; padding: 0">
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
        <a href={$url("./:id/view", { id: inventoryTransaction.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />View</a
        >
        {#if updateGranted && inventoryTransaction.status === "UNAPPROVED"}
          <a
            href={$url("./:id/update", { id: inventoryTransaction.id })}
            class="dropdown-item"
            on:click|stopPropagation={() => {}}
            on:mouseup={closeHandler}><i class="icon-trash-alt" />Edit</a
          >
        {/if}
        {#if removeGranted && inventoryTransaction.status === "UNAPPROVED"}
          <a
            href={$url("./:id/remove", { id: inventoryTransaction.id })}
            class="dropdown-item"
            on:click|stopPropagation={() => {}}
            on:mouseup={closeHandler}><i class="icon-pencil" />Hapus</a
          >
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
