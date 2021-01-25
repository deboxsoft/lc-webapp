<!--routify:options title="Posting Transaksi Jurnal"-->
<script lang="ts">
  import type { FormStore } from "@deboxsoft/svelte-forms";

  import { url } from "@roxi/routify";
  import { getBreadcrumbStore, BREADCRUMB_CONTEXT } from "__@stores/breadcrumb";

  import Icon from "@deboxsoft/svelte-theme-limitless/components/Icon.svelte";
  import Form from "@deboxsoft/svelte-forms/Form.svelte";
  import InputField from "@deboxsoft/svelte-forms/InputField.svelte";
  import Modal from "@deboxsoft/svelte-theme-limitless/components/Modal.svelte";
  import SaveIcon from "@deboxsoft/svelte-icons/SaveTwoTone.svelte";
  import DialogPosting from "./_dialog-posting-jurnal.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import AutoComplete from "__@comps/AutoComplete.svelte";

  const { setBreadcrumb } = getBreadcrumbStore();
  setBreadcrumb({ path: $url("./"), title: "posting jurnal" });

  let formStore: FormStore;
  let formEl: HTMLFormElement;
  let openDialogShow: boolean = false;
  let _accountSelected;

  const akunList = [
    { id: 1, kode: "1000", name: "Kas" },
    { id: 2, kode: "2000", name: "Pendapatan" },
    { id: 3, kode: "3000", name: "Piutang" },
    { id: 4, kode: "4000", name: "Modal" },
    { id: 5, kode: "5000", name: "Utang" },
    { id: 6, kode: "6000", name: "Pembelian" }
  ];

  // handler
  function openDialogInputHandler() {}

  function closeAddDialogInputHandler() {}

  function accountSelectedHandler(_account) {
    _accountSelected = _account;
    if (_accountSelected) {
      openDialogShow = true;
    }
  }
</script>

<Modal bind:open={openDialogShow}>
  <DialogPosting account={_accountSelected} />
</Modal>
<PageLayout>
  <div class="header-elements" slot="header-elements">
    <a href={$url('./')} class="btn btn-link btn-float text-default" target="_self">
      <Icon class="text-primary" size="large" component={SaveIcon} />
    </a>
  </div>
  <div class="d-flex flex-column h-100">
    <div class="card">
      <div class="card-body">
        <Form bind:formStore bind:ref={formEl} >
          <div class="row">
            <div class="form-group col-md-6">
              <label>Tanggal</label>
              <InputField name="date" type="date" class="form-control" placeholder="Tanggal" />
            </div>
            <div class="form-group col-md-6">
              <label>No Transaksi</label>
              <InputField name="no" type="text" class="form-control" placeholder="No Transaksi" />
            </div>
          </div>
          <div class="form-group">
            <label>Diskripsi</label>
            <InputField name="transaction" type="text" class="form-control" placeholder="Diskripsi" />
          </div>
        </Form>
      </div>
    </div>
    <div class="card flex-grow-1">
      <div class="card-header header-elements-inline">
        <div class="header-elements">
          <div class="form-group">
            <AutoComplete
              placeholder="Tambah Akun"
              items={akunList}
              onChange={accountSelectedHandler}
              labelFunction={(akun) => `${akun.kode}  ${akun.name}`}
              valueFieldName="id"
              keywordsFunction={(akun) => `${akun.kode} ${akun.name}`} />
          </div>
        </div>
        <div class="card-title">
          <div>Rincian Jurnal</div>
        </div>
      </div>
      <div class="card-body">
        <table class="table">
          <thead>
            <tr>
              <th class="fit">#</th>
              <th>Akun</th>
              <th class="fit">Debit</th>
              <th class="fit">Kredit</th>
              <th class="fit">#</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer d-flex">
        <div class="flex-grow-1" />
        <div class="">
          <div>Total Debit : Rp. 100.000</div>
          <div>Total Kredit : Rp.100.000</div>
        </div>
      </div>
    </div>
  </div>
</PageLayout>
