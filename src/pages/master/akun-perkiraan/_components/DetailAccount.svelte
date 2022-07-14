<script>
  import { get } from "svelte/store";
  import { url } from "@roxi/routify";
  import { stores } from "@deboxsoft/accounting-client";
  import { getAcc } from "@deboxsoft/accounting-api";
  import { constantCase } from "@deboxsoft/module-core";

  const { getAccount } = stores.getAccountContext();
  const { preferenceStore } = stores.getPreferenceAccountingContext();
  export let account;
  let parent, accountType;
  $: {
    if (!account.isParent) {
      parent = get(getAccount(account.parentId));
    }
    accountType = getAccountType(account, $preferenceStore);
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
    {#if !account.isParent}
      <a href={$url(`../${parent.id}/view`)}>
        {parent.id} - {parent.name}
      </a>
    {:else}
      -
    {/if}
  </p>
  <dt class="col-sm-3">Klasifikasi</dt>
  <p class="col-sm-9">
    : {constantCase(accountType, { delimiter: " " })}
  </p>
</dl>
