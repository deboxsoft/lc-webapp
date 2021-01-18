<script>
  import { Router } from "@roxi/routify";
  import { routes } from "../.routify/routes";
  import { createContextApplication } from "./stores/app";
  import { createContext as createContextStore } from "__@root/stores/ui";

  const { store: uiStore } = createContextStore();

  // set context application
  createContextApplication();

  const BodyClass = (el, { isDark = false, minimizeSidebar, showMobileSidebar }) => {
    const darkClass = "-dark";
    const minimizeSidebarClass = "sidebar-xs";
    const showMobileSidebarClass = "sidebar-mobile-main";
    document.body.classList.add("dbx-theme");
    isDark && document.body.classList.add(darkClass);
    minimizeSidebar && document.body.classList.add(minimizeSidebarClass);
    showMobileSidebar && document.body.classList.add(showMobileSidebarClass);

    return {
      update({ isDark, minimizeSidebar, showMobileSidebar }) {
        isDark ? document.body.classList.add(darkClass) : document.body.classList.remove(darkClass);
        minimizeSidebar
          ? document.body.classList.add(minimizeSidebarClass)
          : document.body.classList.remove(minimizeSidebarClass);
        showMobileSidebar
          ? document.body.classList.add(showMobileSidebarClass)
          : document.body.classList.remove(showMobileSidebarClass);
      }
    };
  };

  // @ts-ignore
  setTimeout(() => window.routify.inBrowser);
</script>

<style lang="scss" global>
  .table td.fit,
  .table th.fit {
    white-space: nowrap;
    width: 1%;
  }
</style>

<div use:BodyClass={$uiStore}>
  <Router {routes} />
</div>
