<!--routify:options title="menu"-->
<script>
  import { getApplicationContext } from "__@modules/app";
  import { getAuthenticationContext } from "__@modules/users";
  import MenuOpen from "@deboxsoft/svelte-icons/ico/icoMenuOpen.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import CardMenuContainer from "__@comps/CardMenuContainer.svelte";
  import CardMenu from "__@comps/CardMenu.svelte";
  const { loading } = getApplicationContext();
  const authContext = getAuthenticationContext();
  const accountShow = authContext.getQuery().read("account").granted;
  const transactionShow = authContext.getQuery().read("transaction").granted;
  const ledgerShow = authContext.getQuery().read("ledger").granted;
  const bankShow = authContext.getQuery().read("bank").granted;
</script>

{#if accountShow || transactionShow || ledgerShow || bankShow}
  <PageLayout breadcrumb={[]}>
    <CardMenuContainer>
      {#if accountShow}
        <CardMenu label="Akun Perkiraan" path="./akun-perkiraan">
          <MenuOpen />
        </CardMenu>
      {/if}
      {#if ledgerShow}
        <CardMenu label="Buku Besar" path="./buku-besar">
          <MenuOpen />
        </CardMenu>
      {/if}
      {#if transactionShow}
        <CardMenu label="Jurnal" path="./jurnal">
          <MenuOpen />
        </CardMenu>
      {/if}
      {#if bankShow}
        <CardMenu label="Rekonsiliasi Bank" path="./rekonsiliasi-bank">
          <MenuOpen />
        </CardMenu>
      {/if}
    </CardMenuContainer>
  </PageLayout>
{/if}
