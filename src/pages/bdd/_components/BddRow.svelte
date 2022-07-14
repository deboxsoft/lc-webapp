<script>
  import { goto, url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { calcAmortization, dayjs } from "@deboxsoft/accounting-api";

  export let bdd;
  export let classes = {};
  let dropdownContext;
  const { bookValue, total, amortizationAccumulation, tax } = calcAmortization(bdd);

  function clickHandler() {
    if (bdd.status === "APPROVED") {
      $goto("./:id/amortization", { id: bdd.id });
    } else {
      $goto("./:id/view", { id: bdd.id });
    }
  }

  /**
   * @param _bdd {import("@deboxsoft/accounting-api").Bdd}
   */
  function isExpired(_bdd) {
    return dayjs().isAfter(_bdd.dateEnd);
  }
</script>

<tr class="cursor-pointer">
  <td class={classes.id} style="text-align: center" on:click={clickHandler}>
    {bdd.id}
  </td>
  <td class={classes.dateStart} style="text-align: center" on:click={clickHandler}>
    <CellDate date={bdd.dateStart} />
  </td>
  <td class={classes.name} on:click={clickHandler}>{bdd.name || ""}</td>
  <td class={classes.monthLife} style="text-align: center" on:click={clickHandler}>{bdd.monthLife || "-"}</td>
  <td class={classes.category} on:click={clickHandler}>{bdd.category || ""}</td>
  <td class={classes.taxRate} style="text-align: center" on:click={clickHandler}>{bdd.taxRate || ""}</td>
  <td class={classes.accumulation} on:click={clickHandler}>
    <CellNumber value={amortizationAccumulation} />
  </td>
  <td class={classes.bookValue} on:click={clickHandler}>
    <CellNumber value={bookValue} />
  </td>
  <td class={classes.amount} on:click={clickHandler}>
    <CellNumber value={bdd.amount} />
  </td>
  <td class={classes.total} on:click={clickHandler}>
    <CellNumber value={total} />
  </td>
  <td class={classes.status} style="text-align: center" on:click={clickHandler}>
    <TransactionStatus status={bdd.status} />
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
        {#if bdd.status === "APPROVED"}
          <a href={$url("./:id/amortization", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}>
            <i class="icon-clipboard3" />
            Rekap depreciation
          </a>
        {/if}
        <a href={$url("./:id/view", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}>
          <i class="icon-eye" />
          Lihat BDD
        </a>
        {#if bdd.status !== "APPROVED"}
          {#if bdd.bddAccount}
            <a href={$url("./:id/update", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}>
              <i class="icon-pencil" />
              Ubah BDD
            </a>
          {/if}
          <a href={$url("./:id/remove", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}>
            <i class="icon-trash-alt" />
            Hapus BDD
          </a>
        {:else if isExpired(bdd)}
          <a href={$url("./:id/remove", { id: bdd.id })} class="dropdown-item" on:mouseup={closeHandler}>
            <i class="icon-trash-alt" />
            Hapus BDD
          </a>
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
