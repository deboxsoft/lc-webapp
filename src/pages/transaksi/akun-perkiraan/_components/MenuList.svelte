<script>
  import { url } from "@roxi/routify";
  import { getAccountContext } from "__@modules/accounting";
  import Dropdown from "__@comps/Dropdown.svelte";

  const { remove, update } = getAccountContext();
  export let id;

  let dropdownTriggerElement;
</script>

<div class="list-icons">
  <Dropdown menuClass="dropdown-menu-right" triggerElement={dropdownTriggerElement} placement="bottom-end">
    <a
      href="/#"
      bind:this={dropdownTriggerElement}
      on:click|preventDefault={() => {}}
      class="list-icons-item align-items-center "
      target="_self"
    >
      <i class="far fa-ellipsis-v-alt" />
    </a>
    <div slot="dropdown-menu">
      <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="fal fa-file-alt" />Lihat Akun</a>
      <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="fal fa-file-edit" />Ubah Akun</a>
      <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="fal fa-trash-alt" />Hapus Akun</a>
    </div>
  </Dropdown>
</div>
