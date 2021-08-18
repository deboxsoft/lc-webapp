<script>
  export let program;
</script>

  <dl class="row">
    <dt class="col-sm-3">Nama</dt>
    <p class="col-sm-9">
      : {program.name}
    </p>
    <dt class="col-sm-3">Diskon</dt>
    <p class="col-sm-9">
      : {program.discount || "-"}
    </p>
    <dt class="col-sm-3">Biaya</dt>
    <p class="col-sm-9">
      : {program.amount || "-"}
    </p>
  </dl>
