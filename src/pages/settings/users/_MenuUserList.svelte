<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";

  export let id;
  export let removeActDisable = false;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil5" />Ubah User</a>
      <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-user-minus" />Hapus User</a>
    </svelte:fragment>
  </Dropdown>
</div>
