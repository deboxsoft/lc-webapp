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
   * @type{import("@deboxsoft/accounting-api").StockTransaction}
   */
  export let stockTransaction;
  let dropdownContext;

  function getTotal(items) {
    return (items || []).reduce((result, item) => {
      return result + item.price * item.quantity;
    }, 0);
  }
</script>

<tr class="cursor-pointer">
  <td on:click>{stockTransaction.no || ""}</td>
  <td class="text-center" on:click>
    {#if stockTransaction.date}
      <CellDate date={stockTransaction.date} />
    {:else}
      -
    {/if}
  </td>
  <td class="text-center" on:click>
    {#if stockTransaction.datePurchase}
      <CellDate date={stockTransaction.datePurchase} />
    {:else}
      -
    {/if}
  </td>
  <td on:click>{stockTransaction.description || ""}</td>
  <td on:click>
    {#if stockTransaction.mutation === "STOCK_IN"}
      masuk
    {:else}
      keluar
    {/if}
  </td>
  <td on:click><CellNumber value={getTotal(stockTransaction.productItems)} /></td>
  <td on:click><TransactionStatus status={stockTransaction.status} /> </td>
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
        <a href={$url("./:id/view", { id: stockTransaction.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-eye" />View</a
        >
        {#if updateGranted && stockTransaction.status !== "APPROVED"}
          <a href={$url("./:id/update", { id: stockTransaction.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-pencil" />Edit</a
          >
        {/if}
        {#if removeGranted && stockTransaction.status !== "APPROVED"}
          <a href={$url("./:id/remove", { id: stockTransaction.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-trash-alt" />Hapus</a
          >
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
