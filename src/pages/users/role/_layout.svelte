<!--routify:options title="Akses Pengguna"-->
<script>
  import Table from "__@comps/Table.svelte";
  import { getAccessControlContext } from "__@modules/users";
  import { url, goto } from "@roxi/routify";
  import Dropdown from "__@comps/Dropdown.svelte";
  import DropdownToggle from "__@comps/DropdownToggle.svelte";
  import { createAclContext } from "../_acl-context";
  import { getBreadcrumbStore } from "__@stores/breadcrumb";
  import PageLayout from "__@root/layout/PageLayout.svelte";

  const { readGranted, createGranted } = createAclContext();
  const { load, grants } = getAccessControlContext();
  if (!readGranted) {
    $goto("/access-denied");
  }
  const { setBreadcrumbContext, breadcrumbStore } = getBreadcrumbStore();
  setBreadcrumbContext({ path: $url("./"), title: "akses pengguna" });
  let roles;

  $: roles = Object.keys($grants);
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-plus2" />
        Tambah Role
      </a>
    {/if}
    <a href="#/" target="_self" on:click={() => load()} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <Table items={roles} let:item={role}>
        <div class="dbx-thead" slot="header">
          <div class="dbx-cell">Nama Hak Akses</div>
          <div class="dbx-cell -menu-list" />
        </div>
        <div class="dbx-tr">
          <div class="dbx-cell">{role}</div>
          <div class="dbx-cell -menu-list" style="width: 30px">
            <div class="list-icons">
              <Dropdown>
                <DropdownToggle class="list-icons-item align-items-center" tag="div">
                  <i class="icon-menu9" />
                </DropdownToggle>
                <svelte:fragment slot="menu">
                  <a href={$url("./:role/view", { role })} class="dropdown-item"><i class="icon-eye" />Detail Role</a>
                  <a href={$url("./:role/update", { role })} class="dropdown-item"
                    ><i class="icon-pencil5" />Ubah Role</a
                  >
                  <a href={$url("./:role/remove", { role })} class="dropdown-item"
                    ><i class="icon-minus2" />Hapus Role</a
                  >
                </svelte:fragment>
              </Dropdown>
            </div>
          </div>
        </div>
      </Table>
    </div>
  </div>
  <slot />
</PageLayout>
