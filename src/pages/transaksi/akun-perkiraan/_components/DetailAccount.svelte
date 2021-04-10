<script>
  import { url } from "@roxi/routify";

  export let account;
</script>

<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="col-6">Kode</div>
      <div class="col-6">
        {account.id}
      </div>
    </div>
    <div class="row">
      <div class="col-6">Nama</div>
      <div class="col-6">
        {account.name}
      </div>
    </div>
    <div class="row">
      <div class="col-6">Akun Induk</div>
      <div class="col-6">
        {#if account.parentId}
          <a href={$url(`../${account.parentId}/view`)}>
            {account.parentId}
          </a>
        {:else}
          -
        {/if}
      </div>
    </div>
  </div>
</div>
