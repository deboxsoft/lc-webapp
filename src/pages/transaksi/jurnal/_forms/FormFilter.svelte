<script>
  import { stores } from "@deboxsoft/accounting-client";

  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboBox from "__@comps/forms/ComboxField.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import dayjs from "dayjs";

  export let filter = {};
  export let title = "Filter";
  export let submit;
  export let isReport = false;
  export let openDialog;
  export let closeDialog;
  let endDate = isReport && new Date() || undefined;
  let startDate = endDate && dayjs(endDate).startOf("month").toDate();

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;

  const { accountStore } = stores.getAccountContext();

  function transformInput({status, date, ...input}) {
    if (Array.isArray(date)) {
      startDate = date[0]
      endDate = date[1]
    } else if (date) {
      startDate = date
    }
    return {
      startDate,
      endDate,
      status: status === "" ? undefined : status,
      ...input
    }
  }

</script>

<Modal {title} bind:onClose bind:openDialog bind:closeDialog >
  <Form bind:values={filter} transform={transformInput} bind:submitHandler={submit} feedbackValidateDisable >
    <div class="form-group">
      <label for="date">Tanggal</label>
      <InputDate name="date" mode="menu" placeholder="Tanggal" allowEmpty={!isReport} defaultDate={[startDate, endDate]} />
    </div>
    <div class="form-group">
      <label for="accountId">Akun Debit</label>
      <AccountSelect id="accountId" placeholder="SEMUA" allowEmpty name="accountId" accountStore={accountStore} />
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <ComboBox id="status" name="status" items={["UNAPPROVED", "FIXED", "APPROVED"]} placeHolder="SEMUA" allowEmpty />
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
