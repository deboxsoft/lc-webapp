<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted, removeGranted } = getAclContext();

  export let id;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("../:bankId/statements", { bankId: id })} class="dropdown-item"
        ><i class="icon-file-excel" />Rekonsiliasi</a
      >
      {#if updateGranted}
        <a href={$url("../home/:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Bank</a>
      {/if}
      {#if removeGranted}
        <a href={$url("../home/:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Bank</a>
      {/if}
    </svelte:fragment>
  </Dropdown>
</div>
