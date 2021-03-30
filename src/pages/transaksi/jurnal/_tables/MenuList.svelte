<script>
  import { goto, url } from "@roxi/routify";
  import { getTransactionContext } from "__@modules/accounting";
  import Dropdown from "__@comps/Dropdown.svelte";

  const { remove } = getTransactionContext();
  export let transactionId;

  let dropdownTriggerElement;

  function removeHandler() {
    $goto("./:id/remove", { id: transactionId });
  }
</script>

<div class="list-icons">
  <Dropdown menuClass="dropdown-menu-right" triggerElement={dropdownTriggerElement} placement="bottom-end">
    <a
      href="/#"
      bind:this={dropdownTriggerElement}
      on:click|preventDefault={() => {}}
      class="list-icons-item dropdown-toggle align-items-center "
      target="_self"
    >
      <i class="icon-menu7" />
    </a>
    <div slot="dropdown-menu">
      <a href={$url("./:id/view", { id: transactionId })} class="dropdown-item"
        ><i class="icon-file-stats" />Lihat Transaksi</a
      >
      <a href="/#" class="dropdown-item" on:click|preventDefault={removeHandler}><i class="icon-trash" />Hapus</a>
    </div>
  </Dropdown>
</div>
