<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { getAclContext } from "../_acl-context";

  const { updateGranted, removeGranted } = getAclContext();

  export let id;
  export let removeActDisable = false;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="icon-eye" />Lihat Akun</a>
      {#if updateGranted}
        <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Akun</a>
      {/if}
      {#if !removeActDisable && removeGranted}
        <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Akun</a>
      {/if}
    </svelte:fragment>
  </Dropdown>
</div>
