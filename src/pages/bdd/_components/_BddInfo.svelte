<script>
  import CellDate from "__@comps/CellDate.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";

  /** @type {import("@deboxsoft/accounting-api").Bdd} **/
  export let bdd;
  export let amortizationAccumulation, amortizationAmount, amortizationRemaining, tax, bookValue, rate, total;
  const className = $$props.class || "";
  console.log(bdd);
</script>

<div class={className}>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nama</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px">{bdd.name}</span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tanggal Approve</dt>
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
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Jumlah Amortisasi</dt>
    <p class="col-sm-7 mb-0">: {`${bdd.amortizationCount} dari ${bdd.monthLife} bulan`}</p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Diamortisasi Setiap Tanggal</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber format="number" value={bdd.amortizationDayOfMonth} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Amortisasi</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={amortizationAmount} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Tarif</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"
        ><CellNumber format="number" value={rate}>
          {bdd.taxRate ? `%` : ""}
        </CellNumber></span
      >
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akum. Amortization</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={amortizationAccumulation} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Buku</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={bookValue} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akun di Debet</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={bdd.debitAccount} />
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akun Pembayaran</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={bdd.creditAccount} />
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Akun Pajak</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      :&nbsp;<CellAccount id={bdd.taxAccount} />
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Pajak (%)</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px">
        <CellNumber format="number" value={bdd.taxRate}>
          {bdd.taxRate ? `%` : ""}
        </CellNumber>
      </span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Nilai Pajak</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={tax} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Harga</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={bdd.amount} /></span>
    </p>
  </dl>
  <dl class="row mb-0">
    <dt class="col-sm-5 mb-0">Total Harga</dt>
    <p class="col-sm-7 mb-0 d-inline-flex align-items-center">
      : &nbsp<span style="width: 150px"><CellNumber value={total} /></span>
    </p>
  </dl>
</div>
