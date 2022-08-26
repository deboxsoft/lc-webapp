<script>
  import Spinner from "./Spinner.svelte";
  import Container from "./LoaderContainer.svelte";

  /**
   *
   * @type {""}
   */
  export let type = undefined;
</script>

<Container>
  <Spinner spinner={type} />
</Container>
