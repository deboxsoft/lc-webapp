<script>
  import { url } from "@roxi/routify";
  import Dropdown from "../../../../../components/Dropdown.svelte";
  import DropdownToggle from "../../../../../components/DropdownToggle.svelte";
  export let id;
</script>

<div class="list-icons">
  <Dropdown>
    <DropdownToggle class="list-icons-item align-items-center" tag="div">
      <i class="icon-menu9" />
    </DropdownToggle>
    <svelte:fragment slot="menu">
      <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Statement</a>
    </svelte:fragment>
  </Dropdown>
</div>
