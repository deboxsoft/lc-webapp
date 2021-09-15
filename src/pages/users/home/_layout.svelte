<!--routify:options title="Manajemen Pengguna"-->
<script>
  import { goto, url } from "@roxi/routify";
  import Table from "../../../components/Table.svelte";
  import { getUserContext } from "../../../modules/users";
  import MenuUserList from "./_MenuUserList.svelte";
  import { getApplicationContext } from "__@modules/app";
  import GroupName from "../group/_groupName.svelte";
  import { createAclContext } from "../_acl-context";
  import PageLayout from "../../../layout/PageLayout.svelte";

  const { readGranted, createGranted } = createAclContext();
  const { loading } = getApplicationContext();
  const { userStore, groupStore, find } = getUserContext();

  if (!readGranted) {
    $goto("/access-denied");
  }

  function getGroup(id) {
    const i = $groupStore.findIndex((_) => _.id === id);
    return $groupStore[i];
  }
</script>

<PageLayout breadcrumb={[]}>
  <svelte:fragment slot="breadcrumb-items-right">
    {#if createGranted}
      <a href={$url("./create")} class="breadcrumb-elements-item">
        <i class="icon-user-plus" />
        Tambah User
      </a>
    {/if}
    <a href="#/" target="_self" on:click={() => find()} class="breadcrumb-elements-item">
      <i class="icon-sync mr-1" />
      Refresh
    </a>
  </svelte:fragment>
  <div class="card d-flex flex-1 flex-column">
    <div class="card-body d-flex flex-1">
      <Table items={$userStore} let:item={user}>
        <div class="dbx-thead" slot="header">
          <div class="dbx-cell username">Username</div>
          <div class="dbx-cell">Nama</div>
          <div class="dbx-cell email">Email</div>
          <div class="dbx-cell group">Group</div>
          <!--        <div class="dbx-cell status">status</div>-->
          <div class="dbx-cell -menu-list" />
        </div>
        <div class="dbx-tr">
          <div class="dbx-cell username">{user.username || ""}</div>
          <div class="dbx-cell">{user.name || ""}</div>
          <div class="dbx-cell email">{user.email || ""}</div>
          <div class="dbx-cell group"><GroupName id={user.groupId} /></div>
          <!--        <div class="dbx-cell status">{user.status || ""}</div>-->
          <div class="dbx-cell -menu-list" style="width: 30px">
            <MenuUserList id={user.id} />
          </div>
        </div>
      </Table>
    </div>
  </div>
  <slot />
</PageLayout>

<style lang="scss">
  .username {
    flex: 0 0 200px;
  }

  .email {
    flex: 0 0 200px;
  }

  .status {
    flex: 0 0 100px;
  }

  .group {
    flex: 0 0 150px;
  }
</style>
