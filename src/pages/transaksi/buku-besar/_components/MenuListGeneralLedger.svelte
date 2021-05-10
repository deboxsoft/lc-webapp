<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import ArrowRight from "@deboxsoft/svelte-icons/ico/icoArrowRight.svelte";

  export let isParent = false;
</script>

<div class="list-icons">
  {#if isParent}
    <a class="list-icons-item align-items-center">
      <div class="icon">
        <ArrowRight />
      </div>
    </a>
  {:else}
    <Dropdown let:toggle let:toggleClass>
      <a
        href="/#"
        on:click|preventDefault={toggle}
        class="list-icons-item align-items-center {toggleClass}"
        target="_self"
      >
        <Dropdown let:toggle let:toggleClass>
          <a
            href="/#"
            on:click|preventDefault={toggle}
            class="list-icons-item align-items-center {toggleClass}"
            target="_self"
          >
            <i class="icon-menu9" />
          </a>
          <div slot="menu">
            {#if !readonly}
              <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={approveHandler}
              ><i class="icon-check2" />Approve</a
              >
            {/if}
            <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="icon-eye" />Lihat Transaksi</a>
            {#if !readonly}
              <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Akun</a>
              <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Transaksi</a>
            {/if}
          </div>
        </Dropdown>

      </a>
      <div slot="menu">
        {#if !readonly}
          <a href="/#" class="dropdown-item" target="_self" on:click|preventDefault={approveHandler}
            ><i class="icon-check2" />Approve</a
          >
        {/if}
        <a href={$url("./:id/view", { id })} class="dropdown-item"><i class="icon-eye" />Lihat Transaksi</a>
        {#if !readonly}
          <a href={$url("./:id/update", { id })} class="dropdown-item"><i class="icon-pencil" />Ubah Akun</a>
          <a href={$url("./:id/remove", { id })} class="dropdown-item"><i class="icon-trash-alt" />Hapus Transaksi</a>
        {/if}
      </div>
    </Dropdown>
  {/if}
</div>
