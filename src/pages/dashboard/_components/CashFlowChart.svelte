<script>
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const className = $$props.class || "";
  const selectOptions = [
    {
      id: "period",
      label: "Tahun Ini"
    },
    {
      id: "month",
      label: "Bulan Ini"
    },
    {
      id: "week",
      label: "Minggu Ini"
    }
  ];
  /**
   * @type {HTMLElement}
   */
  let containerEl,
    tooltipEvt,
    loading = false;
</script>

<div class="card {className}">
  <div class="card-header header-elements-sm-inline py-sm-0">
    <h6 class="card-title py-sm-3">CASHFLOW OPERASIONAL</h6>
    <div class="header-elements">
      <a href="#" disabled class="list-icons-item mr-2">
        <i class="icon-reset" />
      </a>
      <ComboxField items={selectOptions} style="width: unset" />
    </div>
  </div>
  <div class="card-body" />
</div>
