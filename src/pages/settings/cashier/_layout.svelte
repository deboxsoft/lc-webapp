<!--routify:options title="kasir"-->
<script>
  import Table from "__@comps/Table.svelte";

  let users = [];
  function saveHandler() {}

</script>
<div class="card d-flex flex-1 flex-column">
  <div class="card-body d-flex flex-1">
    <Table items={users} let:item={user}>
      <div class="dbx-thead" slot="header">
        <div class="dbx-cell">username</div>
        <div class="dbx-cell">name</div>
        <div class="dbx-cell">email</div>
        <div class="dbx-cell">akun kas</div>
        <div class="dbx-cell">akun perkiraan</div>
        <div class="dbx-cell">status</div>
      </div>
      <div class="dbx-tr">
        <div class="dbx-cell">{user.username || ""}</div>
        <div class="dbx-cell">{user.name || ""}</div>
        <div class="dbx-cell">{user.username || ""}</div>
        <div class="dbx-cell">{user.email || ""}</div>
        <div class="dbx-cell">{user.accountCash || ""}</div>
        <div class="dbx-cell">{user.accounts || ""}</div>
        <div class="dbx-cell">{user.status || ""}</div>
      </div>
    </Table>
  </div>
</div>
<slot />
