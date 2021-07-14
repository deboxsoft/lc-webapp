<script>
  import { get } from "svelte/store";
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";

  const { getAccountType, getAccount } = stores.getAccountContext();
  export let account;
  let parent, accountType;
  $: {
    if (account.parentId) {
      parent = get(getAccount(account.parentId));
    }
    accountType = get(getAccountType(account));
  }

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
      {#if parent}
        <a href={$url(`../${parent.id}/view`)}>
          {parent.id} - {parent.name}
        </a>
      {:else}
        -
      {/if}
    </p>
    <dt class="col-sm-3">Klasifikasi</dt>
    <p class="col-sm-9">
      : {accountType?.label || ""}
    </p>
  </dl>
