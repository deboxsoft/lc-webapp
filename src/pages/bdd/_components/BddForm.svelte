<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import dayjs from "dayjs";
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

  const { getAccountLeaf } = stores.getAccountContext();

  const { notify, loading } = getApplicationContext();
  const { getAmortization, amortizationStore } = stores.getBddContext();

  // props
  export let bdd;
  export let isUpdate = false;
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

<Modal bind:openDialog {title} onClose={closeHandler}>
  <Form checkValidateFirst {schema} values={{ ...bdd }} bind:fields bind:fieldsErrors bind:isValid>
    <div class="row">
      <div class="form-group col-12">
        <label for="date">Tanggal</label>
        <InputDateField id="date" name="date" class="form-control" placeholder="Tanggal" range={false} disabled />
      </div>
    </div>
    {#if !isUpdate}
      <div class="row">
        <div class="form-group col-12 col-md-6">
          <label for="dateStart">Tanggal Mulai</label>
          <InputDateField
            id="dateStart"
            name="dateStart"
            class="form-control"
            placeholder="Tanggal Mulai"
            startDate={dayjs().subtract(10, "year")}
            endDate={dayjs()}
            range={false}
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="dateEnd">Tanggal Akhir</label>
          <InputDateField
            id="dateEnd"
            name="dateEnd"
            class="form-control"
            placeholder="Tanggal Akhir"
            startDate={dayjs()}
            endDate={dayjs().add(10, "year")}
            range={false}
            yearEditable
          />
        </div>
      </div>
    {/if}
    {#if !isUpdate}
      <div class="row">
        <div class="form-group col-6">
          <label for="debitAccount">Akun BDD</label>
          <AccountSelect
            accountStore={getAccount("bdd")}
            id="debitAccount"
            name="debitAccount"
            placeholder="Akun Amortisasi"
            allowEmpty
          />
        </div>
        <div class="form-group col-6">
          <label for="creditAccount">Akun Pembayaran</label>
          <AccountSelect
            accountStore={getAccount("cash")}
            id="creditAccount"
            name="creditAccount"
            placeholder="Akun Pembayaran"
            allowEmpty
          />
        </div>
      </div>
      <div class="row">
        <div class="form-group col-6">
          <label for="expenseAccount">Akun Biaya Amortisasi</label>
          <AccountSelect
            accountStore={getAccount("expense")}
            id="expenseAccount"
            name="expenseAccount"
            placeholder="Akun Biaya Amortisasi"
            allowEmpty
          />
        </div>
        <div class="form-group col-6">
          <label for="amortizationAccount">Akun Akumulasi BDD</label>
          <AccountSelect
            accountStore={getAccount("accumulation")}
            id="amortizationAccount"
            name="amortizationAccount"
            placeholder="Akun Akumulasi BDD"
            allowEmpty
          />
        </div>
      </div>
    {/if}
    <div class="row">
      <div class="form-group col-8">
        <label for="description">Keterangan</label>
        <InputField id="description" name="description" type="text" class="form-control" placeholder="Keterangan" />
      </div>
      <div class="form-group col-4">
        <label for="category">Jenis</label>
        <InputField id="category" name="category" type="text" class="form-control" placeholder="Jenis" />
      </div>
    </div>
    {#if !isUpdate}
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
          />
        </div>
        <div class="form-group col-12 col-md-6">
          <label for="priceItem">Jumlah</label>
          <InputNumberField id="priceItem" name="amount" class="form-control" placeholder="Jumlah" />
        </div>
      </div>
    {/if}
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
