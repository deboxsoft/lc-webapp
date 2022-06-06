<script>
  import { getCashierContext, getProgramContext } from "@deboxsoft/lc-cashier-client";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellDate from "__@comps/CellDate.svelte";
  import TransactionStatus from "__@comps/transactions/TransactionStatus.svelte";
  import { stores as storesUser } from "@deboxsoft/users-client";
  const { getCashier } = getCashierContext();
  const { getProgram, programStore } = getProgramContext();
  const { getUser } = storesUser.getAuthenticationContext();

  /**
   * @type{Cashier}
   */
  export let cashier;

  let createBy, approveBy;
  (async () => {
    if (cashier.approveBy) {
      createBy = approveBy = "...loading";
      const userCreatePromise = getUser(cashier.userId);
      const userApprovePromise = getUser(cashier.approveBy);
      const [createByUser, approveByUser] = Promise.all([userCreatePromise, userApprovePromise]);
      createBy = createByUser?.name;
      approveBy = approveByUser?.name;
    }
  })();
</script>

<dl class="row">
  <dt class="col-sm-3 mb-0">No Kwitansi</dt>
  <p class="col-sm-9 mb-0">
    : {cashier.no || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Tanggal</dt>
  <p class="col-sm-9 mb-0">
    : <CellDate date={cashier.date} />
  </p>
  <dt class="col-sm-3 mb-0">Program</dt>
  <p class="col-sm-9 mb-0">
    : {getProgram(cashier.programId)?.name || "-"}
  </p>
  <dt class="col-sm-3 mb-0">Nama Siswa</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : {cashier.student}
  </p>
  <dt class="col-sm-3 mb-0">Keterangan</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    : {cashier.description || ""}
  </p>
  <dt class="col-sm-3 mb-0">Nominal</dt>
  <div class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;
    <div style="width: 150px">
      <CellNumber value={cashier.amount} />
    </div>
  </div>
  <dt class="col-sm-3 mb-0">Di Input Oleh</dt>
  <p class="col-sm-9 mb-0">: {createBy || "-"}</p>
  <dt class="col-sm-3 mb-0">Di Approve Oleh</dt>
  <p class="col-sm-9 mb-0">: {approveBy || "-"}</p>
  <dt class="col-sm-3 mb-0">Status</dt>
  <p class="col-sm-9 mb-0 d-inline-flex align-items-center">
    :&nbsp;<TransactionStatus status={cashier.status} />
  </p>
</dl>
