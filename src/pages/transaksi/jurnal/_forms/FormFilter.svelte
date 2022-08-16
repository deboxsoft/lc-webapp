<script>
  import { stores } from "@deboxsoft/accounting-client";
  import Modal from "__@comps/Modal.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import ComboBox from "__@comps/forms/ComboxField.svelte";
  import InputDate from "__@comps/forms/InputDateField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import dayjs from "dayjs";
  import InputField from "__@comps/forms/InputField.svelte";

  export let filter = writable({});
  export let title = "Filter";
  export let isReport = false;
  export let openDialog;
  export let closeDialog;
  let endDate = (isReport && new Date()) || undefined;
  let startDate = endDate && dayjs(endDate).startOf("month").toDate();
  let fields, clearDate, clearAccount;

  /**
   *
   * @type {undefined | Function}
   */
  export let onClose = undefined;

  const { accountStore } = stores.getAccountContext();
  const { transactionTypeStore } = stores.getTransactionContext();

  export function clearFilter() {
    $filter = $fields = {};
    clearDate();
    clearAccount();
  }

  export function submitFilter() {
    const { id, status, date, type, accountId, ...input } = $fields;
    let _startDate, _endDate;
    if (input.to) {
      _startDate = input.from;
      _endDate = input.to;
    } else if (date) {
      _startDate = date;
    }
    return {
      id: id === "" ? undefined : id,
      startDate: _startDate,
      endDate: _endDate,
      status: status === "" ? undefined : status,
      type: type === "" ? undefined : type,
      accountId: accountId || undefined
    };
  }
</script>

<Modal {title} bind:onClose bind:openDialog bind:closeDialog>
  <Form values={$filter} feedbackValidateDisable bind:fields>
    <div class="form-group">
      <label for="id">Transaksi Id</label>
      <InputField id="id" name="id" placeholder="Transaksi Id" />
    </div>
    <div class="form-group">
      <label for="date">Tanggal</label>
      <InputDate
        id="date"
        mode="menu"
        placeholder="Tanggal"
        allowEmpty={!isReport}
        defaultDate={[startDate, endDate]}
        showClearButton
        bind:clearDate
      />
    </div>
    <div class="form-group">
      <label for="accountId">Akun Debit</label>
      <AccountSelect
        id="accountId"
        placeholder="SEMUA"
        allowEmpty
        name="accountId"
        {accountStore}
        bind:clearAccountValue={clearAccount}
      />
    </div>
    <div class="form-group">
      <label for="type">Jenis Transaksi</label>
      <ComboBox
        id="type"
        name="type"
        items={$transactionTypeStore}
        labelId="name"
        valueId="code"
        placeHolder="SEMUA"
        allowEmpty
      />
    </div>
    <div class="form-group">
      <label for="status">Status</label>
      <ComboBox
        id="status"
        name="status"
        items={["UNAPPROVED", "FIXED", "APPROVED", "REJECTED", "BLACKLIST"]}
        placeHolder="SEMUA"
        allowEmpty
      />
    </div>
  </Form>
  <slot name="footer" slot="footer" />
</Modal>
