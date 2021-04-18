<script>
  import { get } from "svelte/store";
  import { url } from "@roxi/routify";
  import { getAccountContext } from "__@modules/accounting";

  const { getAccountType, getAccount } = getAccountContext();
  export let account;
</script>

<dl class="row">
  <dt class="col-sm-3">Kode</dt>
  <p class="col-sm-9">
    : {account.id}
  </p>
  <dt class="col-sm-3">Nama</dt>
  <p class="col-sm-9">
    : {account.name}
  </p>
  <dt class="col-sm-3">Induk</dt>
  <p class="col-sm-9">
    :
    {#if account.parentId}
      <a href={$url(`../${account.parentId}/view`)}>
        {account.parentId} - {get(getAccount(account.parentId)).name}
      </a>
    {:else}
      -
    {/if}
  </p>
  <dt class="col-sm-3">Klasifikasi</dt>
  <p class="col-sm-9">
    : {get(getAccountType(account))?.label || ""}
  </p>
</dl>
