<script>
  import { url } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import CellNumber from "__@comps/CellNumber.svelte";
  import CellAccount from "__@comps/account/CellAccount.svelte";
  import BalanceAccount from "__@comps/account/BalanceAccount.svelte";
  import { getAclContext } from "../../_acl-context";

  const { updateGranted, removeGranted } = getAclContext();
  let dropdownContext;

  export let className = $$props.class || "";
  export let bank;
  let toggle;
</script>

<tr class={className}>
  <td>
    <div>
      <div class="text-default font-weight-semibold">
        {bank.name || ""}
      </div>
      <div class="text-muted font-size-sm">
        {bank.branch ? `cabang ${bank.branch}` : ""}
      </div>
    </div>
  </td>
  <td>
    <div>
      <div class="text-default font-weight-semibold">
        {bank.nameAccountBank || ""}
      </div>
      <div class="text-muted font-size-sm">
        {bank.noAccountBank || ""}
      </div>
    </div>
  </td>
  <td>
    <div>
      <div class="text-default font-weight-semibold">
        <CellAccount id={bank.accountId} />
      </div>
      <div class="text-muted font-size-sm">
        {bank.accountId}
      </div>
    </div>
  </td>
  <td>
    <CellNumber class="flex-1 align-items-center" value={bank.balance} />
  </td>

  <td>
    <BalanceAccount class="flex-1 align-items-center" id={bank.accountId} />
  </td>
  <td>
    <BalanceAccount
      class="flex-1 align-items-center"
      id={bank.accountId}
      value={(_value) => parseFloat(bank.balance || 0) - _value}
    />
  </td>
  <td style="width: 30px;cursor: pointer;padding: 0">
    <Dropdown
      class="h-100 d-flex justify-content-center"
      bind:context={dropdownContext}
      menuProps={{
        offset: [0, -15]
      }}
    >
      <DropdownToggle bind:toggle class="list-icons-item d-flex flex-1 align-items-center" tag="div">
        <i class="icon-menu9" />
      </DropdownToggle>
      <svelte:fragment slot="menu" let:closeHandler>
        <a href={$url("../:bankId/statements", { bankId: bank.id })} class="dropdown-item" on:mouseup={closeHandler}
          ><i class="icon-file-excel" />Rekonsiliasi</a
        >
        {#if updateGranted}
          <a href={$url("../home/:id/update", { id: bank.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-pencil" />Ubah Bank</a
          >
        {/if}
        {#if removeGranted}
          <a href={$url("../home/:id/remove", { id: bank.id })} class="dropdown-item" on:mouseup={closeHandler}
            ><i class="icon-trash-alt" />Hapus Bank</a
          >
        {/if}
      </svelte:fragment>
    </Dropdown>
  </td>
</tr>
