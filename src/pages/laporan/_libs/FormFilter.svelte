<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "../../../components/Modal.svelte";
  import Form from "../../../components/forms/Form.svelte";
  import InputDate from "../../../components/forms/InputDateField.svelte";

  export let filter = {};
  export let title = "Filter";
  export let submit;
  export let isReport = false;
  export let openDialog;
  export let closeDialog;
  // let date = dayjs(endDate).startOf("month").toDate();
  let date;
  let state = filter;
  if (date) {
    filter.date = date;
  }

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;

  const { accountStore } = stores.getAccountContext();
</script>

<Modal {title} bind:onClose bind:openDialog bind:closeDialog >
  <Form values={filter} bind:submitHandler={submit} feedbackValidateDisable >
    <div class="form-group">
      <label for="date">Tanggal</label>
      <InputDate mode="menu" placeholder="Tanggal" allowEmpty={!isReport} range={false} />
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
