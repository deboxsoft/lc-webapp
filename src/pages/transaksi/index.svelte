<!--routify:options title="menu"-->
<script lang="ts">
  import MenuOpen from "@deboxsoft/svelte-icons/MenuOpen.svelte";
  import PageLayout from "__@root/layout/PageLayout.svelte";
  import CardMenuContainer from "__@comps/CardMenuContainer.svelte";
  import CardMenu from "__@comps/CardMenu.svelte";
</script>

<PageLayout breadcrumb={[]}>
  <CardMenuContainer>
    <CardMenu label="Akun Perkiraan" path="./akun-perkiraan">
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Buku Besar" path="./buku-besar" >
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Jurnal" path="./jurnal">
      <MenuOpen />
    </CardMenu>
    <CardMenu label="Rekonsiliasi Bank" path="./rekonsiliasi-bank" >
      <MenuOpen />
    </CardMenu>
  </CardMenuContainer>
</PageLayout>
