<script>
  import { goto, url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import { createProgramContext } from "@deboxsoft/lc-cashier-client";
  import { getApplicationContext } from "__@modules/app";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";

  const applicationContext = getApplicationContext();
  const { getProgram, programStore, find } = createProgramContext(applicationContext);

  export let cashier;
  export let classes;
  let dropdownContext, program;

  $: {
    if (!program && cashier && $programStore) {
      program = getProgram(cashier.programId).name;
    }
  }

  function clickHandler() {
    $goto("./:id/view", { id: cashier.id });
  }
</script>

<tr class="cursor-pointer">
  <td style="text-align: center" on:click={clickHandler}>{cashier.no || ""}</td>
  <td on:click={clickHandler}><CellDate date={cashier.date} /></td>
  <td on:click={clickHandler}>{program || ""}</td>
  <td on:click={clickHandler}>{cashier.student}</td>
  <td on:click={clickHandler}>{cashier.description || ""}</td>
  <td on:click={clickHandler}><TransactionStatus status={cashier.status} /></td>
  <td on:click={clickHandler}>
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
          ><i class="icon-pencil" />Edit</a
        >
        <a href={$url("./:id/remove", { id: cashier.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Hapus</a
        >
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
