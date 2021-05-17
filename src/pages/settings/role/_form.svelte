<script>
  import { getAccessControlContext } from "__@modules/users";
  import { getApplicationContext } from "__@modules/app";
  import RoleTreeView from "./_role-tree-view.svelte";

  const { grants, save } = getAccessControlContext();
  const { notify, loading } = getApplicationContext();

  export let onSaved = () => {};
  export let role;
  export let isUpdate = false;
  export let readOnly = false;

  let roles;
  let grantRole = {};
  const schemaRole = {
    account: {
      label: "akun perkiraan",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        },
        {
          label: "hapus",
          value: "delete:any",
          selected: false
        }
      ]
    },
    transaction: {
      label: "transaksi",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "approve",
          value: "approve:any",
          selected: false
        },
        {
          label: "reject",
          value: "reject:any",
          selected: false
        },
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah:pembuat",
          value: "update:own",
          selected: false
        },
        {
          label: "hapus:pembuat",
          value: "delete:own",
          selected: false
        }
      ]
    },
    bank: {
      label: "bank",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        },
        {
          label: "hapus",
          value: "delete:any",
          selected: false
        },
        {
          label: "rekonsiliasi",
          value: "approve:any",
          selected: false
        }
      ]
    },
    ledger: {
      label: "buku besar",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "lihat",
          value: "read:any",
          selected: false
        }
      ]
    },
    balanceSheet: {
      label: "neraca",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "lihat",
          value: "read:any",
          selected: false
        }
      ]
    },
    statementIncome: {
      label: "laba-rugi",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "lihat",
          value: "read:any",
          selected: false
        }
      ]
    },
    inventory: {
      label: "inventaris",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        },
        {
          label: "hapus",
          value: "delete:any",
          selected: false
        }
      ]
    },
    bdd: {
      label: "bdd",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        },
        {
          label: "hapus",
          value: "delete:any",
          selected: false
        }
      ]
    },
    user: {
      label: "manajemen user",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "buat",
          value: "create:any",
          selected: false
        },
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        },
        {
          label: "hapus",
          value: "delete:any",
          selected: false
        }
      ]
    },
    setting: {
      label: "pengaturan aplikasi",
      selected: false,
      indeterminate: false,
      actions: [
        {
          label: "lihat",
          value: "read:any",
          selected: false
        },
        {
          label: "ubah",
          value: "update:any",
          selected: false
        }
      ]
    }
  };

  const resources = Object.keys(schemaRole);
  $: {
    if (Object.keys($grants).length > 0) {

      if (!roles) {
        roles = Object.keys($grants);
        if (role) {
          delete roles[role];
          const _grants = $grants[role] || {};
          for (const resource of resources) {
            if (_grants[resource]) {
              const _keysGrants = Object.keys(_grants[resource]);
              _keysGrants.forEach((act) => {
                if (act) {
                  let _count = 0;
                  const i = schemaRole[resource].actions.findIndex((_) => _.value === act);
                  if (i > -1) {
                    schemaRole[resource].actions[i].selected = true;
                  }
                }
              });
              if (_keysGrants.length > 0) {
                if (_keysGrants.length === schemaRole[resource].actions.length) {
                  schemaRole[resource].selected = true;
                  schemaRole[resource].indeterminate = false;
                } else {
                  schemaRole[resource].indeterminate = true;
                  schemaRole[resource].selected = false;
                }
              } else {
                schemaRole[resource].selected = false;
                schemaRole[resource].indeterminate = false;
              }
            } else {
              schemaRole[resource].selected = false;
              schemaRole[resource].indeterminate = false;
            }
          }
        }
      }
    }
  }

  export async function saveHandler() {
    try {
      $loading = true;
      if (!roles || roles.length === 0) {
        roles = Object.keys($grants);
      }
      if (!role) throw new Error("nama role harus diisi");
      if (!isUpdate && roles.includes(role)) {
        throw new Error("role sudah terdaftar");
      }
      grantRole = {};
      resources.forEach((resource) => {
        grantRole[resource] = {};
        schemaRole[resource].actions.forEach((act) => {
          if (act.selected) {
            grantRole[resource][act.value] = ["*"];
          }
        });
      });
      // rubah klo ada space
      role = role.replace(/ /g, "_").toUpperCase();
      const inputs = {
        ...$grants,
        ...{
          [role]: grantRole
        }
      };
      await save(inputs);
      notify(`Berhasil menyimpan role ${role}`, "success");
      onSaved();
      $loading = false;
    } catch (e) {
      $loading = false;
      notify(e.message || `Gagal menyimpan role ${role}`, "error");
    }
  }
</script>

<div class="card">
  <div class="card-body">
    <div class="row">
      <div class="form-group col-12">
        <label for="role">Nama Hak Akses</label>
        <input
          id="role"
          name="role"
          type="text"
          class="form-control"
          placeholder="Role"
          bind:value={role}
          disabled={isUpdate}
        />
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        Detail Hak Akses
      </div>
    </div>
    <div class="row px-2">
      <div class="role-checkbox-tree col-md-4 col-12">
        <ol class="role-view">
          {#each [resources[0], resources[1], resources[2]] as resourceKey}
            <RoleTreeView
              {readOnly}
              resource={resourceKey}
              label={schemaRole[resourceKey].label}
              bind:checked={schemaRole[resourceKey].selected}
              bind:indeterminate={schemaRole[resourceKey].indeterminate}
              bind:actions={schemaRole[resourceKey].actions}
            />
          {/each}
        </ol>
      </div>
      <div class="role-checkbox-tree col-md-4 col-12">
        <ol class="role-view">
          {#each [resources[3], resources[4], resources[5], resources[6], resources[7]] as resourceKey}
            <RoleTreeView
              {readOnly}
              resource={resourceKey}
              label={schemaRole[resourceKey].label}
              bind:checked={schemaRole[resourceKey].selected}
              bind:indeterminate={schemaRole[resourceKey].indeterminate}
              bind:actions={schemaRole[resourceKey].actions}
            />
          {/each}
        </ol>
      </div>
      <div class="role-checkbox-tree col-md-4 col-12">
        <ol class="role-view">
          {#each [resources[8], resources[9]] as resourceKey}
            <RoleTreeView
              {readOnly}
              resource={resourceKey}
              label={schemaRole[resourceKey].label}
              bind:checked={schemaRole[resourceKey].selected}
              bind:indeterminate={schemaRole[resourceKey].indeterminate}
              bind:actions={schemaRole[resourceKey].actions}
            />
          {/each}
        </ol>
      </div>
    </div>
  </div>
</div>

<style>
  .role-checkbox-tree {
    display: flex;
    flex-direction: row;
    border: 1px dotted #bebebe;
    padding: 10px;
    margin-top: 0;
    flex-wrap: wrap;
  }

  .role-view {
    flex: 1;
    padding-left: 24px;
    margin: 0;
    list-style-type: none;
  }
</style>
