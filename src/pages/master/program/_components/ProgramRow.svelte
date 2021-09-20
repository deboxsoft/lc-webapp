<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { getAclContext } from "../_acl-context";

  const { updateGranted, removeGranted } = getAclContext();
  export let program;
  $: id = program.id;
  let dropdownContext;
</script>

<tr>
  <td>{program.name || ""}</td>
  <td>{program.period || ""}</td>
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
      <a href={$url("./:id/view", { id })} class="dropdown-item" on:mouseup={closeHandler}
        ><i class="icon-eye" />Lihat Program</a
      >
      {#if updateGranted}
        <a href={$url("./:id/update", { id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-pencil" />Edit Program</a
        >
      {/if}
      {#if removeGranted}
        <a href={$url("./:id/remove", { id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-trash-alt" />Hapus Program</a
        >
      {/if}
    </svelte:fragment>
  </Dropdown>
</tr>
