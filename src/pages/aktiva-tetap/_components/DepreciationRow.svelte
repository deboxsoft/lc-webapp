<script>
  // import { url } from "@roxi/routify";
  // import Dropdown from "__@comps/Dropdown.svelte";
  // import DropdownToggle from "__@comps/DropdownToggle.svelte";

  export let depreciation = {};
  let dropdownContext;
</script>

<tr>
  <td>{depreciation.month || ""}</td>
  <td>{depreciation.amount}</td>
<!--  <td style="cursor: pointer; padding: 0">-->
<!--    <Dropdown-->
<!--      class="h-100 d-flex justify-content-center"-->
<!--      bind:context={dropdownContext}-->
<!--      menuProps={{-->
<!--        offset: [0, -15]-->
<!--      }}-->
<!--    >-->
<!--      <DropdownToggle class="list-icons-item d-flex align-items-center" tag="div">-->
<!--        <i class="icon-menu9" />-->
<!--      </DropdownToggle>-->
<!--      <svelte:fragment slot="menu">-->
<!--        <a href={$url("./:id/transaction", { id: depreciation.transactionId })} class="dropdown-item"-->
<!--        ><i class="icon-clipboard3" />Lihat Transaksi</a-->
<!--        >-->
<!--      </svelte:fragment>-->
<!--    </Dropdown>-->
<!--  </td>-->
</tr>
