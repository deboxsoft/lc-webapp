<script>
  import CellDate from "__@comps/CellDate.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  /** @type {import("@deboxsoft/accounting-api").Bdd} **/
  export let bdd;
  export let amortizationAccumulation,
    amortizationAmount,
    amortizationRemaining,
    tax,
    bookValue,
    rate,
    total,
    totalPayment;
  const className = $$props.class || "";
</script>

<div class={className}>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nama</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp
      <span>{bdd.name}</span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal {bdd.status === "APPROVED" ? "Approve" : ""}</dt>
    <p class="col-sm-7 mb-0">: <CellDate date={bdd.date} format="DD-MMMM-YYYY" /></p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal Perolehan</dt>
    <p class="col-sm-7 mb-0">: <CellDate date={bdd.dateStart} format="DD-MMMM-YYYY" /></p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal Akhir</dt>
    <p class="col-sm-7 mb-0">: <CellDate date={bdd.dateEnd} format="DD-MMMM-YYYY" /></p>
  </dl>
  {#if bdd.bddAccount}
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Akun Bdd</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        :&nbsp;<CellAccount id={bdd.bddAccount} />
      </p>
    </dl>
  {/if}
  {#if bdd.taxAccount}
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Akun Pajak</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        :&nbsp;<CellAccount id={bdd.taxAccount} />
      </p>
    </dl>
  {/if}
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akun Akumulasi Amortisasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={bdd.amortizationAccount} />
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akun Beban Amortisasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={bdd.expenseAccount} />
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Jumlah Amortisasi</dt>
    <p class="col-sm-7 mb-0">: {`${bdd.amortizationCount} dari ${bdd.monthLife} bulan`}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Diamortisasi Setiap Tanggal</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      <span>: &nbsp</span>
      <span class="flex-1 pr-1"><CellNumber format="number" value={bdd.amortizationDayOfMonth} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Amortisasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      <span>: &nbsp</span>
      <span class="flex-1 pr-1"><CellNumber value={amortizationAmount} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tarif</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      <span>: &nbsp</span>
      <span class="flex-1 pr-1">
        <CellNumber format="number" value={rate}>
          {bdd.taxRate ? `%` : ""}
        </CellNumber>
      </span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akum. Amortization</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      <span>: &nbsp</span>
      <span class="flex-1 pr-1"><CellNumber value={amortizationAccumulation} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Buku</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      <span>: &nbsp</span>
      <span class="flex-1 pr-1"><CellNumber value={bookValue} /></span>
    </p>
  </dl>
  {#if bdd.amount}
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Nilai BDD</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        <span>: &nbsp</span>
        <span class="flex-1 pr-1"><CellNumber value={bdd.amount} /></span>
      </p>
    </dl>
  {:else}
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Pajak (%)</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        <span>: &nbsp</span>
        <span class="flex-1 pr-1">
          <CellNumber format="number" value={bdd.taxRate}>
            {bdd.taxRate ? `%` : ""}
          </CellNumber>
        </span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Nilai Pajak</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span><CellNumber value={tax} /></span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Total Harga Sebelum Pajak</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span><CellNumber value={totalPayment} /></span>
      </p>
    </dl>
    <dl class="row mb-0">
      <dt class="col-sm-5 mb-0">Total Harga</dt>
      <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
        : &nbsp
        <span><CellNumber value={total} /></span>
      </p>
    </dl>
  {/if}
</div>
