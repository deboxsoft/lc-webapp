<script>
  import CellNumber from "__@comps/CellNumber.svelte";
  import { stores } from "@deboxsoft/accounting-client";

  const { getFixedBalanceAccount } = stores.getBalanceContext();

  export let hiddenBalance = false;
  export let isForm = false;
  /**
   * @type {Partial<import("@deboxsoft/accounting-api").Account>}
   */
  export let account = {};

  /**
   * @type {Partial<import("@deboxsoft/accounting-api").Bank>}
   */
  export let bank = {};
  export let balanceAccount = undefined;
  export let balanceBank = undefined;
  $: {
    if (!hiddenBalance && account?.id && balanceAccount === undefined) {
      getFixedBalanceAccount(account.id, {}).then((_) => {
        balanceAccount = _ || 0;
        if (bank) {
          balanceBank = bank.balance || 0;
        }
      });
    }
  }

  $: {
    if (!hiddenBalance && bank && balanceBank === undefined) {
      balanceBank = bank.balance;
    }
  }
</script>

<div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">Nama bank</dt>
    <p class="col-sm-9 mb-0">
      : <span class="font-weight-bold text-uppercase">{bank.name}</span>
      {bank.cabang ? `cabang ${bank.branch}` : ""}
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">No Rekening</dt>
    <p class="col-sm-9 mb-0">: {bank.noAccountBank}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">An. Rekening</dt>
    <p class="col-sm-9 mb-0">: {bank.nameAccountBank}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
    <p class="col-sm-9 mb-0">: {account.name}</p>
  </dl>
  {#if !hiddenBalance}
    <dl class="row mb-0">
      <dt class="col-sm-3 mb-0">Saldo Akun Perkiraan</dt>
      <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
        : <div style="width: 150px"><CellNumber class="ml-1" value={balanceAccount} /></div>
      </div>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-3 mb-0">Saldo Rekening Bank</dt>
      <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
        : <div style="width: 150px"><CellNumber class="ml-1" value={balanceBank} /></div>
      </div>
    </dl>
  {/if}
  {#if isForm}
    <dl class="row mb-0">
      <dt class="col-sm-3 mb-0">Download Template CSV</dt>
      <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
        :
        <a href={`/templates/rekonsiliasi.csv`} class="ml-1" target="_self">rekonsiliasi.csv</a>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-3 mb-0">Download Template Excel</dt>
      <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
        :
        <a href={`/templates/rekonsiliasi.xlsx`} class="ml-1" target="_self">rekonsiliasi.xlsx</a>
      </p>
    </dl>
  {/if}
</div>
