<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { goto } from "@roxi/routify";
  import Modal from "__@comps/Modal.svelte";
  import { getApplicationContext } from "__@modules/app";
  import { stores } from "@deboxsoft/accounting-client";

  import InputField from "__@comps/forms/InputField.svelte";
  import AccountSelect from "__@comps/account/AccountSelect.svelte";
  import InputDateField from "__@comps/forms/InputDateField.svelte";
  import Form from "__@comps/forms/Form.svelte";
  import InputNumberField from "__@comps/forms/InputNumberField.svelte";
  import {
    filteringAccountBdd,
    filteringAccountCash,
    filteringAccountAccumulationAmortization,
    filteringAccountExpenseAmortization
  } from "__@root/utils";
  import { convertToNumber } from "__@root/utils";

  const { getAccountLeaf } = stores.getAccountContext();

  const { notify, loading } = getApplicationContext();
  const { getAmortization, amortizationStore } = stores.getBddContext();

  // props
  export let bdd;
  export let onSubmit;
  export let title;
  export let to = "./";
  export let schema;

  // state
  let openDialog,
    fields,
    isValid = writable(false),
    fieldsErrors,
    submitting = false;

  onMount(() => {
    openDialog();
  });

  $: taxValue = $fields?.taxRate ? (parseFloat($fields.taxRate) * parseFloat($fields?.amount || "0")) / 100 : 0;

  function getAccount(accountType) {
    const accountStore = getAccountLeaf();
    switch (accountType) {
      case "bdd": {
        return filteringAccountBdd(accountStore);
      }
      case "cash": {
        return filteringAccountCash(accountStore);
      }
      case "expense": {
        return filteringAccountExpenseAmortization(accountStore);
      }
      case "accumulation": {
        return filteringAccountAccumulationAmortization(accountStore);
      }
      default: {
        return accountStore;
      }
    }
  }

  async function submitHandler() {
    try {
      $loading = true;
      submitting = true;
      const input = schema.parse($fields);
      await onSubmit(input);
      $goto(to);
    } catch (error) {
      console.error(error);
      notify(`${error.message}`, "error");
    } finally {
      submitting = false;
      $loading = false;
    }
  }

  function closeHandler() {
    $goto(to);
  }
</script>

<Modal class="modal-lg" bind:openDialog {title} onClose={closeHandler}>
  <div class="card flex-grow-1">
    <div class="card-body">
      <Form checkValidateFirst {schema} values={{ ...bdd }} bind:fields bind:fieldsErrors bind:isValid>
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="dateStart">Tanggal Perolehan *</label>
            <InputDateField
              id="dateStart"
              name="dateStart"
              class="form-control"
              placeholder="Tanggal Perolehan *"
              range={false}
              yearEditable
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="monthLife">Umur (Bulan) *</label>
            <InputNumberField
              format="number"
              id="monthLife"
              name="monthLife"
              class="form-control"
              placeholder="Jangka Waktu (Bulan) *"
              maximumValue="10000"
              minimumValue="0"
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-4">
            <label for="debitAccount">Akun BDD *</label>
            <AccountSelect
              accountStore={getAccount("bdd")}
              id="debitAccount"
              name="debitAccount"
              placeholder="Akun BDD *"
              allowEmpty
            />
          </div>
          <div class="form-group col-4">
            <label for="creditAccount">Akun Pembayaran *</label>
            <AccountSelect
              accountStore={getAccount("cash")}
              id="creditAccount"
              name="creditAccount"
              placeholder="Akun Pembayaran *"
              allowEmpty
            />
          </div>
          <div class="form-group col-4">
            <label for="taxAccount">Akun Pajak</label>
            <AccountSelect
              accountStore={getAccount("tax")}
              id="taxAccount"
              name="taxAccount"
              placeholder="Akun Pajak"
              allowEmpty
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-6">
            <label for="expenseAccount">Akun Biaya Amortisasi *</label>
            <AccountSelect
              accountStore={getAccount("expense")}
              accountId={bdd?.expenseAccount}
              id="expenseAccount"
              name="expenseAccount"
              placeholder="Akun Biaya Amortisasi *"
              allowEmpty
            />
          </div>
          <div class="form-group col-6">
            <label for="amortizationAccount">Akun Akumulasi BDD *</label>
            <AccountSelect
              accountStore={getAccount("accumulation")}
              accountId={bdd?.amortizationAccount}
              id="amortizationAccount"
              name="amortizationAccount"
              placeholder="Akun Akumulasi BDD *"
              allowEmpty
            />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-8">
            <label for="description">Nama *</label>
            <InputField id="name" name="name" type="text" class="form-control" placeholder="Nama *" />
          </div>
          <div class="form-group col-4">
            <label for="category">Jenis</label>
            <InputField id="category" name="category" type="text" class="form-control" placeholder="Jenis" />
          </div>
        </div>
        <div class="row">
          <div class="form-group col-12 col-md-6">
            <label for="categoryId">Pajak (%)</label>
            <InputNumberField
              format="number"
              id="taxRate"
              name="taxRate"
              class="form-control"
              placeholder="Pajak (%)"
              maximumValue="100"
              minimumValue="0"
              decimalEnable
            />
          </div>
          <div class="form-group col-12 col-md-6">
            <label for="priceItem">Jumlah *</label>
            <InputNumberField id="priceItem" name="amount" class="form-control" placeholder="Jumlah *" />
          </div>
        </div>
      </Form>
    </div>
    <div class="card-footer d-flex">
      <div class="flex-grow-1" />
      <div class="d-flex flex-column" style="width: 250px">
        <div class="d-flex">
          <span class="flex-grow-1">Nominal: Rp.</span>
          <span>{$fields?.amount ? convertToNumber({ value: parseFloat($fields.amount) }) : "-"}</span>
        </div>
        <div class="d-flex">
          <span class="flex-grow-1">Pajak: Rp.</span>
          <span>{$fields?.taxRate ? convertToNumber({ value: taxValue }) : "-"}</span>
        </div>
        <div class="d-flex" style="border-top: solid 1px gray">
          <span class="flex-grow-1 color-red"> Total: Rp.</span>
          <span>{$fields?.amount ? convertToNumber({ value: $fields.amount + taxValue }) : "-"}</span>
        </div>
      </div>
    </div>
  </div>
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
