<script>
  import CellAccount from "__@comps/account/CellAccount.svelte";

  export let categoryProduct;
</script>

<dl class="row">
  <dt class="col-sm-5">Nama</dt>
  <p class="col-sm-7">
    : {categoryProduct.name || "-"}
  </p>
  <dt class="col-sm-5">Akun Persediaan</dt>
  <p class="col-sm-7 d-inline-flex align-items-center">
    : <CellAccount class="ml-1" id={categoryProduct.accountId} />
  </p>
</dl>
