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
  let state = filter;
  if (endDate) {
    filter.date = [startDate, endDate]
  }

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;

  const { accountStore } = stores.getAccountContext();
  const {transactionTypeStore} = stores.getTransactionContext();

  function transformInput({status, date, type, accountId, ...input}) {
    let _startDate, _endDate;

    if (Array.isArray(date)) {
      _startDate = date[0]
      _endDate = date[1]
    } else if (date) {
      _startDate = date
    }
    return {
      startDate: _startDate,
      endDate: _endDate,
      status: status === "" ? undefined : status,
      type: type === "" ? undefined : type,
      accountId: accountId || undefined,
      ...input
    }
  }

</script>

<Modal {title} bind:onClose bind:openDialog bind:closeDialog >
  <Form values={filter} transform={transformInput} bind:submitHandler={submit} feedbackValidateDisable >
    <div class="form-group">
      <label for="date">Tanggal</label>
      <InputDate mode="menu" placeholder="Tanggal" allowEmpty={!isReport} defaultDate={[filter.startDate, filter.endDate]} showClearButton />
    </div>
    <div class="form-group">
      <label for="accountId">Akun Debit</label>
      <AccountSelect id="accountId" placeholder="SEMUA" allowEmpty name="accountId" {accountStore} />
    </div>
    <div class="form-group">
      <label for="type">Jenis Transaksi</label>
      <ComboBox id="type" name="type" items={$transactionTypeStore} labelId="name" valueId="code" placeHolder="SEMUA" allowEmpty />
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <ComboBox id="status" name="status" items={["UNAPPROVED", "FIXED", "APPROVED"]} placeHolder="SEMUA" allowEmpty />
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
