<script>
  import { createEventDispatcher, onMount } from "svelte";
  import { writable } from "svelte/store";
  import AccountSelect from "../../../components/account/AccountSelect.svelte";

  import { goto } from "@roxi/routify";
  import Modal from "../../../components/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputDate from "../../../components/forms/InputDateField.svelte";
  import Form from "../../../components/forms/Form.svelte";
  import InputField from "../../../components/forms/InputField.svelte";
  import InputNumberField from "../../../components/forms/InputNumberField.svelte";
  import {
    filteringAccountCash,
    filteringAccountExpense,
    filteringAccountStock
  } from "../../../utils";

  const { notify, loading } = getApplicationContext();
  const { stockStore } = stores.getStockTransferContext();
  const { getAccountLeaf } = stores.getAccountContext();
  const dispatch = createEventDispatcher();

  // props
  export let stock;
  export let onSubmit;
  export let schema;
  export let title;
  /** @type {"IN" | "OUT" | undefined} */
  export let transform = undefined;
  export let to = "./";

  // state
  let openDialog,
    fields,
    fieldsErrors,
    submitting = false,
    isValid = writable(false);

  onMount(() => {
    openDialog();
  });

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "stock": {
        return filteringAccountStock(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
      case "expense": {
        return filteringAccountExpense(accountStore);
      }
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      await onSubmit($fields);
      $goto(to);
    } catch (error) {
      console.error(error);
      notify(`${error.errors[0].message}`, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }
</script>

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={stock} bind:fields bind:fieldsErrors bind:isValid>
    <div class="row">
      <div class="form-group col-12 col-md-6">
        <label for="name">Nama</label>
        <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama" disabled={transform} />
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
          disabled
        />
      </div>
    </div>
    {#if !transform}
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="debitAccount">Akun Barang</label>
          <AccountSelect
            id="debitAccount"
            name="debitAccount"
            placeholder="Akun Barang"
            allowEmpty
            accountStore={getAccount("stock")}
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="creditAccount">Akun Pembayaran</label>
          <AccountSelect
            id="creditAccount"
            name="creditAccount"
            placeholder="Akun Pembayaran"
            allowEmpty
            accountStore={getAccount("cash")}
          />
        </div>
      </div>
    {/if}
    {#if transform === "IN"}
      <div class="row">
        <div class="form-group col-12">
          <label for="creditAccount">Akun Pembayaran</label>
          <AccountSelect
            id="creditAccount"
            name="creditAccount"
            placeholder="Akun Pembayaran"
            allowEmpty
            accountStore={getAccount("cash")}
          />
        </div>
      </div>
    {:else if transform === "OUT"}
      <div class="row">
        <div class="form-group col-12">
          <label for="debitAccount">Akun Biaya</label>
          <AccountSelect
            id="debitAccount"
            name="debitAccount"
            placeholder="Akun Biaya"
            allowEmpty
            accountStore={getAccount("expense")}
          />
        </div>
      </div>
    {/if}
    <div class="row">
      {#if !transform || transform === "IN"}
        <div class="form-group col-12 col-md-6">
          <label for="quantity">Jumlah</label>
          <InputNumberField id="quantity" name="quantity" class="form-control" format="number" placeholder="Jumlah" />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="price">Harga</label>
          <InputNumberField id="price" name="price" class="form-control" placeholder="Harga" />
        </div>
      {:else}
        <div class="form-group col-12">
          <label for="quantity">Jumlah</label>
          <InputNumberField
            id="quantity"
            name="quantity"
            class="form-control"
            format="number"
            placeholder="Jumlah"
            validate={(_) => {
              if (!_ || _ === 0) {
                $fieldsErrors = { ...$fieldsErrors, quantity: ["Jumlah barang harus diisi dan tidak boleh 0"] };
              } else if (_ > stock.quantity) {
                $fieldsErrors = {
                  ...$fieldsErrors,
                  quantity: ["Permintaan barang melebihi dari barang yang disediakan"]
                };
              } else {
                fieldsErrors.update((_) => {
                  delete _.quantity;
                  return _;
                });
              }
            }}
          />
        </div>
      {/if}
    </div>
  </Form>
  <svelte:fragment slot="footer">
    <button type="button" class="btn btn-outline bg-primary text-primary border-primary" on:click={closeHandler}>
      Tutup
    </button>
    <button type="button" class="btn btn-primary ml-1" disabled={!$isValid || submitting} on:click={submitHandler}>
      <i class="icon-floppy-disk mr-2" />
      Simpan
    </button>
  </svelte:fragment>
</Modal>
