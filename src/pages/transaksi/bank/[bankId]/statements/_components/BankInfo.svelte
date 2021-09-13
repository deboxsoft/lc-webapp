<script>
  import CellNumber from "../../../../../../components/CellNumber.svelte";

  export let bank;
  export let account;
  export let balanceAccount = $account.balance;
  export let hiddenBalance = false;

  $: balanceBank = $bank.balance;
</script>

<div class="border-bottom-grey-600 border-bottom-1 mb-1 pb-1">
  <dl class="row mb-0">
    <dt class="col-sm-3 mb-0">Nama bank</dt>
    <p class="col-sm-9 mb-0">
      : <span class="font-weight-bold text-uppercase">{$bank.name}</span>
      {$bank.cabang ? `cabang ${$bank.branch}` : ""}
    </p>
    <dt class="col-sm-3 mb-0">No Rekening</dt>
    <p class="col-sm-9 mb-0">: {$bank.noAccountBank}</p>
    <dt class="col-sm-3 mb-0">An. Rekening</dt>
    <p class="col-sm-9 mb-0">: {$bank.nameAccountBank}</p>
    <dt class="col-sm-3 mb-0">Akun Perkiraan</dt>
    <p class="col-sm-9 mb-0">: {$account.name}</p>
    {#if !hiddenBalance}
      <dt class="col-sm-3 mb-0">Saldo Akun Perkiraan</dt>
      <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
        : <div style="width: 150px"><CellNumber class="ml-1" value={balanceAccount} /></div>
      </div>
      <dt class="col-sm-3 mb-0">Saldo Rekening Bank</dt>
      <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
        : <div style="width: 150px"><CellNumber class="ml-1" value={balanceBank} /></div>
      </div>
    {/if}
  </dl>
</div>
