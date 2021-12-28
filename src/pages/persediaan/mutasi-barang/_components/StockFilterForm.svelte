<script>
  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import dayjs from "dayjs";
  import { writable } from "svelte/store";

  export let submit;
  export let title;
  export let openDialog;
  export let onClose;

  const now = dayjs();
  const filter = {
    period: "daily",
    date: dayjs().toDate(),
    month: String(dayjs().month()),
    year: String(dayjs().year())
  }
  let fields = writable(filter);

  getYears()
  function getYears() {
    const yearNow = dayjs().year();
    const items = [];
    for (let i = 0; i < 5; i++) {
      const year = yearNow - i;
      items.push({
        id: `${year}`,
        label: year
      })
    }
    return items;
  }

  const months = [
    { id: "0",label: "Januari" },
    { id: "1",label: "Februari" },
    { id: "2",label: "Maret" },
    { id: "3",label: "April" },
    { id: "4",label: "Mei" },
    { id: "5",label: "Juni" },
    { id: "6",label: "Juli" },
    { id: "7",label: "Agustus" },
    { id: "8",label: "September" },
    { id: "9",label: "Oktober" },
    { id: "10",label: "November" },
    { id: "11",label: "Desember" }
  ]
  const items = [
    {
      id: "daily",
      label: "harian"
    },
    {
      id: "monthly",
      label: "bulanan"
    }
  ];

  function transformInput({ period, date, month, year }) {
    let startDate, endDate;
    if (period === "daily") {
      startDate = dayjs(date).startOf("date").toDate();
      endDate = dayjs(date).endOf("date").toDate();
    } else {
      const _date = dayjs().set("month", month).set("year", year).toDate();
      startDate = dayjs(_date).startOf("month").toDate();
      endDate = dayjs(_date).endOf("month").toDate();
    }
    return {
      startDate,
      endDate
    };
  }
</script>

<Modal {title} bind:onClose bind:openDialog>
  <Form values={filter} transform={transformInput} bind:submitHandler={submit} feedbackValidateDisable bind:fields>
    <div class="form-group">
      <label for="period">Periode</label>
      <ComboxField id="period" name="period" {items} />
    </div>
    <div class="form-group">
      <label for="date">{$fields["period"] === "daily" ? "Tanggal" : "Bulan"}</label>
      {#if $fields["period"] === "daily"}
        <InputDateField name="date" selected={new Date()} id="date" />
      {:else}
        <span class="row">
          <div class="col-8">
            <ComboxField id="month" name="month" items={months} />
          </div>
          <div class="col-4">
            <ComboxField id="year" name="year" items={getYears()} />
          </div>
        </span>
      {/if}
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
