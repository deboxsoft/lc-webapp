<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";

  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { StockCreateInputSchema } from "@deboxsoft/accounting-api";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputDate from "__@comps/forms/InputDateField.svelte";
  import InputRp from "__@comps/forms/InputNumberField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputField from "__@comps/forms/InputField.svelte";
  import ComboxField from "__@comps/forms/ComboxField.svelte";

  const { notify, loading } = getApplicationContext();
  const { stockStore } = stores.getStockTransferContext();
  const dispatch = createEventDispatcher();

  // props
  export let stock;
  export const isUpdate = false;
  export let onSubmit;
  export let title;
  export let to = "./";

  // state
  let state = "prepare";
  let openDialog;
  let fields;
  let idReadOnly = true;
  let fieldsErrors = writable([]);
  let submitted = writable(false);

  onMount(() => {
    openDialog();
  })

  async function submitHandler() {
    try {
      state = "submitting"
      $loading = true;
      await onSubmit($fields);
      $loading = false;
      state = "success"
      $goto(to);
    } catch (error) {
      state = "failed";
      notify(`${error.errors[0].message}`, "error");
      $loading = false;
    }
  }

  function closeHandler() {
    state = "close"
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form schema={StockCreateInputSchema} values={stock} bind:fields bind:submitted>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="date">Tanggal</label>
        <InputDate
          id="date"
          name="date"
          class="form-control"
          placeholder="Tanggal"
          value={new Date()}
          range={false}
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="dateStart">Tanggal Mulai</label>
        <InputDate
          id="dateStart"
          name="dateStart"
          class="form-control"
          placeholder="Tanggal Mulai"
          value={new Date()}
          range={false}
        />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="dateEnd">Tanggal Akhir</label>
        <InputDate
          id="dateEnd"
          name="dateEnd"
          class="form-control"
          placeholder="Tanggal Akhir"
          value={new Date()}
          range={false}
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="categoryId">Kategori Amortisasi</label>
        <ComboxField
          id="amortizationId"
          name="amortizationId"
          class="form-control"
          items={$stockStore}
          valueId="id"
          labelId="name"
          placeholder="Kategori Amortisasi"
        />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12">
        <label for="creditAccount">Akun Kredit</label>
        <AccountSelect id="creditAccount" name="creditAccount" placeholder="Akun Aset" />
      </div>
    </div>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="quantity">Jumlah</label>
        <InputField id="quantity" name="quantity" class="form-control" type="number" placeholder="Jumlah" />
      </div>
      <div class="form-group col-12 col-md-6">
        <label for="priceItem">Harga</label>
        <InputRp id="priceItem" name="priceItem" class="form-control" placeholder="Harga" />
      </div>
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={$loading} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
